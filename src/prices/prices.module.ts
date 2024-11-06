import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailService } from '../notifications/email.service';

@Module({
  imports: [ConfigModule, PrismaModule, NotificationsModule],
  controllers: [PricesController],
  providers: [PricesService, EmailService, Logger],
  exports: [PricesService],
})
export class PricesModule {}
