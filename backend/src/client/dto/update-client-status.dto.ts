import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { ClientStatut } from '@prisma/client';

export class UpdateClientStatusDto {
  @ApiProperty({
    enum: ClientStatut,
    example: 'ACTIF',
    description: 'Nouveau statut du client.',
  })
  @IsEnum(ClientStatut)
  @IsNotEmpty()
  statut!: ClientStatut;
}
