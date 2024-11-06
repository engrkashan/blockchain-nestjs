import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PricesModule } from '../prices/prices.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PricesModule, NotificationsModule, PrismaModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
