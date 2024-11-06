import { IsNumber } from 'class-validator';

export class GetSwapRateDto {
  @IsNumber()
  ethAmount: number;
}
