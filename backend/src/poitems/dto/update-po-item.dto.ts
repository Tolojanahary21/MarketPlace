import { PartialType } from '@nestjs/swagger';

import { CreatePOItemDto } from './create-po-item.dto';

export class UpdatePOItemDto extends PartialType(
  CreatePOItemDto,
) {}