// src/email/email.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'; 
import * as path from 'path'; // <--- Importa el módulo 'path'
import * as fs from 'fs/promises'; // <--- Importa 'fs/promises' para operaciones asíncronas

interface ISendMail {
    to: string;
    subject: string;
    message: string; 
}

@Injectable()
export class EmailService {

  private transporter: Mail;
  private templatesPath: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) { 
    this.transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
       port: 587,
       secure: false, 
       auth: {
          user: this.configService.get<string>('GOOGLE_MAIL_APP_EMAIL'),
          pass: this.configService.get<string>('GOOGLE_MAIL_APP_PASSWORD'),
       },
    });

    this.templatesPath = path.join(__dirname, 'templates', 'email', 'templates');

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error connecting to Gmail SMTP server:', error.message);
        this.logger.error('Check GOOGLE_MAIL_APP_EMAIL and GOOGLE_MAIL_APP_PASSWORD in .env');
        this.logger.error('Ensure 2FA is enabled and App Password is used for Google account.');
      } else {
        this.logger.log('Gmail SMTP server is ready to take our messages');
      }
    });
  }

  // Tu método send generalizado
  async send({ to, subject, message }: ISendMail): Promise<boolean> {
      const mailOptions = {
        from: this.configService.get<string>('GOOGLE_MAIL_APP_EMAIL'), 
        to,
        subject,
        html: message, 
      };

      try {
          const info = await this.transporter.sendMail(mailOptions);
          this.logger.log(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
          return true;
      } catch(error) {
          this.logger.error("Error sending email:", error);
          return false;
      }
  }

  async sendVerificationOtp(to: string, otp: string): Promise<void> {
    const subject = 'EventLearn: Your OTP Verification Code';
    const templatePath = path.join(this.templatesPath, 'otp-verification.html'); // Ruta completa al template

    let htmlMessage: string;
    try {
        const templateContent = await fs.readFile(templatePath, 'utf8');

        htmlMessage = templateContent.replace('{{OTP_CODE}}', otp);

    } catch (error) {
        this.logger.error(`Error reading or processing email template ${templatePath}:`, error.message);
        throw new InternalServerErrorException('Failed to load email template.');
    }

    const sent = await this.send({ to, subject, message: htmlMessage });
    if (!sent) {
        throw new InternalServerErrorException('Failed to send verification email. Please try again.');
    }
  }


  async sendPasswordResetOtp(to: string, otp: string): Promise<void> {
    const subject = 'EventLearn: Password Reset OTP';
    const templatePath = path.join(this.templatesPath, 'otp-reset-password.html');
  
    let htmlMessage: string;
    try {
      const templateContent = await fs.readFile(templatePath, 'utf8');
      htmlMessage = templateContent.replace('{{OTP_CODE}}', otp);
    } catch (error) {
      this.logger.error(`Error reading password reset template at ${templatePath}:`, error.message);
      throw new InternalServerErrorException('Failed to load password reset email template.');
    }
  
    const sent = await this.send({ to, subject, message: htmlMessage });
    if (!sent) {
      throw new InternalServerErrorException('Failed to send password reset email. Please try again.');
    }
  }


}