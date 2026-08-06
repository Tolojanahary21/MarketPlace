// Création de l'utilisateur
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { hashPassword } from '../../../utils/hash.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    // Vérifie si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    // Hash du mot de passe
    const hashedPassword = await hashPassword(createUserDto.password);

    // Création de l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        nom: createUserDto.nom,
        prenom: createUserDto.prenom,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      },
    });
    // Ne jamais retourner le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
