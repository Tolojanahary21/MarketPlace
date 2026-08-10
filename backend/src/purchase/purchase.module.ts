import { Module } from '@nestjs/common';

import { PurchaseOrderService } from './purchase.service';
import { PurchaseOrderController } from './purchase.controller';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseModule {}
