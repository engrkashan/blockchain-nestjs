import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Moralis from '../morails/moralis.config';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class PricesService {
  private readonly logger = new Logger(PricesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Fetch hourly prices from the past 24 hours
  async getHourlyPrices() {
    try {
      return await this.prisma.price.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Error fetching hourly prices', error);
      throw new InternalServerErrorException(
        'Failed to retrieve hourly prices',
      );
    }
  }

  // Set a new alert with target price, chain, and email
  async setAlert(chain: string, targetPrice: number, email: string) {
    try {
      return await this.prisma.alert.create({
        data: { chain, targetPrice, email },
      });
    } catch (error) {
      this.logger.error(`Error setting alert for ${chain}`, error);
      throw new InternalServerErrorException('Failed to set price alert');
    }
  }

  // Fetch latest ETH and Polygon prices and save them to the database
  async fetchAndSavePrices() {
    try {
      const ethPriceData = await this.getEthPrice();
      const polygonPriceData = await this.getPolygonPrice();

      await this.savePriceData(ethPriceData);
      await this.checkAndSendPriceAlerts(ethPriceData);

      await this.savePriceData(polygonPriceData);
      await this.checkAndSendPriceAlerts(polygonPriceData);
    } catch (error) {
      this.logger.error('Error fetching and saving prices', error);
      throw new InternalServerErrorException('Failed to fetch and save prices');
    }
  }

  // Check and send alerts if the target price is reached
  private async checkAndSendPriceAlerts(priceData: {
    price: number;
    chain: string;
  }) {
    try {
      const alerts = await this.prisma.alert.findMany({
        where: {
          chain: priceData.chain,
          targetPrice: { lte: priceData.price },
        },
      });

      for (const alert of alerts) {
        await this.sendPriceAlertEmail(
          alert.email,
          alert.chain,
          alert.targetPrice,
        );
        this.logger.log(
          `Sent price alert email for ${alert.chain} at target price of ${alert.targetPrice}`,
        );
      }
    } catch (error) {
      this.logger.error('Error checking and sending price alerts', error);
      throw new InternalServerErrorException('Failed to process price alerts');
    }
  }

  // Helper function to fetch Ethereum price from Moralis API
  private async getEthPrice() {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        include: 'percent_change',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      });
      return { price: response.raw.usdPrice, chain: 'Ethereum' };
    } catch (error) {
      this.logger.error('Error fetching ETH price', error);
      throw new InternalServerErrorException('Failed to fetch Ethereum price');
    }
  }

  // Helper function to fetch Polygon price from Moralis API
  private async getPolygonPrice() {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: '0x1',
        include: 'percent_change',
        address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      });
      return { price: response.raw.usdPrice, chain: 'Polygon' };
    } catch (error) {
      this.logger.error('Error fetching Polygon price', error);
      throw new InternalServerErrorException('Failed to fetch Polygon price');
    }
  }

  // Save price data to the database
  private async savePriceData(priceData: { price: number; chain: string }) {
    try {
      await this.prisma.price.create({
        data: priceData,
      });
    } catch (error) {
      this.logger.error(
        `Error saving price data for ${priceData.chain}`,
        error,
      );
      throw new InternalServerErrorException('Failed to save price data');
    }
  }

  // Send an email alert for price changes
  private async sendPriceAlertEmail(
    email: string,
    chain: string,
    targetPrice: number,
  ) {
    await this.emailService.sendEmail(
      email,
      'Price Alert',
      `The price of ${chain} has reached your target of $${targetPrice}.`,
    );
  }

  async getSwapRate(ethAmount: number) {
    try {
      const ethToBtcRate = await this.getEthToBtcRate(); // fetch or calculate ETH to BTC rate
      const btcEquivalent = ethAmount * ethToBtcRate;

      // Calculate fees
      const ethFee = ethAmount * 0.03;
      const dollarFee = ethFee * this.getDollarRate();

      return { btcEquivalent, ethFee, dollarFee };
    } catch (error) {
      this.logger.error('Error calculating swap rate', error);
      throw new InternalServerErrorException('Failed to calculate swap rate');
    }
  }

  // Helper to fetch ETH to BTC rate (mocked here, ideally an API call)
  private async getEthToBtcRate() {
    return 0.03;
  }

  // Helper to get a dollar rate; currently hardcoded to 1 for simplicity
  private getDollarRate() {
    return 0.03;
  }
}
