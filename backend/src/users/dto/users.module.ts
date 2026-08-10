import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OtpService } from 'src/auth/otp.service';
import { MailService } from 'src/auth/mail.service';

@Module({
  controllers: [UsersController],

  providers: [UsersService,OtpService,MailService],

  exports: [UsersService],
})
export class UsersModule {}
