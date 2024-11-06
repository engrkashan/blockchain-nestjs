import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService, EmailService], 
})
export class NotificationsModule {}
