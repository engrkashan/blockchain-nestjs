import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Cron job that runs every 10 seconds to check for price changes in the last hour
  @Cron('*/5 * * * *')
  async checkAndSendPriceAlerts() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const chains = ['Ethereum', 'Polygon'];

      for (const chain of chains) {
        // Fetch latest price
        const latestPrice = await this.prisma.price.findFirst({
          where: { chain },
          orderBy: { createdAt: 'desc' },
        });

        // Fetch closest price to 1 hour ago (or earlier if 1-hour data is unavailable)
        const oneHourOldPrice = await this.prisma.price.findFirst({
          where: {
            chain,
            createdAt: { lte: oneHourAgo },
          },
          orderBy: { createdAt: 'desc' },
        });

        // Skip if prices are not available
        if (!latestPrice || !oneHourOldPrice) continue;

        // Calculate the price difference
        const priceDifference = latestPrice.price - oneHourOldPrice.price;

        // Calculate price change percentage with high precision
        const priceChangePercentage = (
          (priceDifference / oneHourOldPrice.price) *
          100
        ).toFixed(2);

        // Send email if any price change occurred or if the change exceeds 3%
        if (
          priceDifference !== 0 &&
          Math.abs(Number(priceChangePercentage)) > 3
        ) {
          await this.emailService.sendAlertEmail(
            process.env.EMAIL_USER,
            chain,
            latestPrice.price,
          );
          this.logger.log(
            `Sent price change alert for ${chain} with change of ${priceChangePercentage}%`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error checking and sending price alerts', error);
      throw new InternalServerErrorException('Failed to process price alerts');
    }
  }
}
