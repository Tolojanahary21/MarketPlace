import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CategoryStatut } from '@prisma/client';

export class UpdateCategoryStatusDto {
  @ApiProperty({
    enum: CategoryStatut,
    example: CategoryStatut.ACTIF,
    description:
      'Nouveau statut de la catégorie.',
  })
  @IsEnum(CategoryStatut)
  statut!: CategoryStatut;
}