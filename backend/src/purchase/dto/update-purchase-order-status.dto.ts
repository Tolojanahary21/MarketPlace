
import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import {
  PurchaseOrderStatut,
} from '@prisma/client';

export class UpdatePurchaseOrderStatusDto {
  @ApiProperty({
    enum: PurchaseOrderStatut,
    example:
      PurchaseOrderStatut.CONFIRMEE,
    description:
      'Nouveau statut du bon de commande.',
  })
  @IsEnum(PurchaseOrderStatut)
  @IsNotEmpty()
  statut!: PurchaseOrderStatut;
}

