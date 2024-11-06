import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PricesService } from '../prices/prices.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly pricesService: PricesService) {}

  // Set cron job to run every 5 minutes
  @Cron('*/5 * * * *')
  async handleCron() {
    try {
      await this.pricesService.fetchAndSavePrices();
      console.log('Prices fetched and saved successfully');
    } catch (error) {
      console.error('Error in scheduled fetch and save:', error.message);
    }
  }
}
