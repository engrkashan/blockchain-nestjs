import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
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

  async sendAlertEmail(to: string, chain: string, price: number) {
    const subject = `Price Alert for ${chain}`;
    const text = `The price of ${chain} has changed to $${price}.`;
    await this.sendEmail(to, subject, text);
  }
}
