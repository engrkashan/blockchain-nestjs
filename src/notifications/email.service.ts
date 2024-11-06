import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService {
  sendEmail(email: string, arg1: string, arg2: string) {
      throw new Error('Method not implemented.');
  }
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // Use true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendAlertEmail(to: string, chain: string, price: number) {
    const subject = `Price Alert for ${chain}`;
    const text = `The price of ${chain} has changed to ${price}.`;

    const mailOptions = {
      from: `"Price Alert" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
