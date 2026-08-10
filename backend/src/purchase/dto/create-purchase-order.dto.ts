import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  PurchaseOrderStatut,
} from '@prisma/client';

export class CreatePurchaseOrderDto {
  // ======================================================
  // PO NUMBER
  // ======================================================

  @ApiProperty({
    example: 'PO-2026-0001',
    description:
      'Numéro unique du bon de commande.',
  })
  @IsString()
  @IsNotEmpty()
  poNumber!: string;

  // ======================================================
  // STATUT
  // ======================================================

  @ApiPropertyOptional({
    enum: PurchaseOrderStatut,
    example: PurchaseOrderStatut.BROUILLON,
    description:
      'Statut du bon de commande.',
  })
  @IsOptional()
  @IsEnum(PurchaseOrderStatut)
  statut?: PurchaseOrderStatut;

  // ======================================================
  // QUOTE
  // ======================================================

  @ApiPropertyOptional({
    example: 1,
    description:
      'ID du devis associé au bon de commande.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quoteId?: number;

  // ======================================================
  // CLIENT
  // ======================================================

  @ApiProperty({
    example: 1,
    description:
      'ID du client associé.',
  })
  @IsInt()
  @Min(1)
  clientId!: number;

  // ======================================================
  // SUPPLIER
  // ======================================================

  @ApiProperty({
    example: 1,
    description:
      'ID du fournisseur associé.',
  })
  @IsInt()
  @Min(1)
  supplierId!: number;

  // ======================================================
  // NOTES
  // ======================================================

  @ApiPropertyOptional({
    example:
      'Livraison souhaitée avant la fin du mois.',
    description:
      'Notes concernant le bon de commande.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // ======================================================
  // TOTAL
  // ======================================================

  @ApiPropertyOptional({
    example: 1250000.5,
    description:
      'Montant total du bon de commande.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  // ======================================================
  // LEAD TIME
  // ======================================================

  @ApiPropertyOptional({
    example: 14,
    description:
      'Délai de livraison en jours.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  leadTime?: number;

  // ======================================================
  // PAYMENT INFO
  // ======================================================

  @ApiPropertyOptional({
    example: {
      mode: 'VIREMENT',
      delai: 30,
    },
    description:
      'Informations relatives aux conditions de paiement.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  paymentInfo?: Record<string, any>;

  // ======================================================
  // SHIPPING INFO
  // ======================================================

  @ApiPropertyOptional({
    example: {
      transporteur: 'DHL',
      adresse: 'Antananarivo',
      delai: 7,
    },
    description:
      'Informations relatives à la livraison.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  shippingInfo?: Record<string, any>;

  // ======================================================
  // ALERTS
  // ======================================================

  @ApiPropertyOptional({
    example: {
      urgent: true,
      message:
        'Livraison urgente demandée.',
    },
    description:
      'Alertes associées au bon de commande.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  alerts?: Record<string, any>;

  // ======================================================
  // TRACKING NOTES
  // ======================================================

  @ApiPropertyOptional({
    example:
      'Colis expédié depuis Antananarivo.',
    description:
      'Notes concernant le suivi de la commande.',
  })
  @IsOptional()
  @IsString()
  trackingNotes?: string;
}

