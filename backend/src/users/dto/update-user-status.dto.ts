import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatut } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatut,
    example: UserStatut.INACTIF,
    description: 'Nouveau statut du compte.',
  })
  @IsEnum(UserStatut)
  statut!: UserStatut;
}