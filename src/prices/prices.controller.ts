import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetSwapRateDto } from './dto/get-swap-rate.dto';
import { SetAlertDto } from './dto/set-alert.dto';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('hourly')
  async getHourlyPrices() {
    try {
      return await this.pricesService.getHourlyPrices();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve hourly prices');
    }
  }

  @Post('alert')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async setAlert(@Body() setAlertDto: SetAlertDto) {
    return this.pricesService.setAlert(
      setAlertDto.chain,
      setAlertDto.targetPrice,
      setAlertDto.email,
    );
  }

  @Post('swap-rate')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getSwapRate(@Body() getSwapRateDto: GetSwapRateDto) {
    return this.pricesService.getSwapRate(getSwapRateDto.ethAmount);
  }
}
