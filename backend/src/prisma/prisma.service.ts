//connexion a PGsql
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Connexion à la base de données au démarrage de NestJS
  async onModuleInit() {
    await this.$connect();
  }
}
