import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; 
import { PricesModule } from './prices/prices.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { initializeMoralis } from '../src/morails/moralis.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PricesModule,
    SchedulerModule,
    NotificationsModule,
    PrismaModule,
  ],
})
export class AppModule {
  constructor() {
    initializeMoralis();
  }
}
