//Route POST /users/register

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // POST /users/register
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
  //Pour les accees Admin
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  admin() {
    return 'Bienvenue Admin';
  }
  //Pour les accees Vendeur
  @Get('vendeur')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDEUR)
  vendeur() {
    return 'Bienvenue Vendeur';
  }
  //Pour les accees Acheteur
  @Get('acheteur')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ACHETEUR)
  acheteur() {
    return 'Bienvenue Acheteur';
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
