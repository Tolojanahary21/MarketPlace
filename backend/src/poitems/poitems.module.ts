import { Module } from '@nestjs/common';

import { POItemService } from './poitems.service';
import { POItemController } from './poitems.controller';

@Module({
  controllers: [POItemController],
  providers: [POItemService],
  exports: [POItemService],
})
export class PoitemsModule {}
