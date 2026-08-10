
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { ClientType } from '@prisma/client';

export class UpdateClientTypeDto {
  @ApiProperty({
    enum: ClientType,
    example: 'PARTICULIER',
    description: 'Nouveau type du client.',
  })
  @IsEnum(ClientType)
  @IsNotEmpty()
  type!: ClientType;
}
