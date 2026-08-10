import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    example: Role.VENDEUR,
    description: 'Nouveau rôle de l’utilisateur.',
  })
  @IsEnum(Role)
  role!: Role;
}