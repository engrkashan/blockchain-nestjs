import { IsString, IsNumber, IsEmail } from 'class-validator';

export class SetAlertDto {
  @IsString()
  chain: string;

  @IsNumber()
  targetPrice: number;

  @IsEmail()
  email: string;
}
