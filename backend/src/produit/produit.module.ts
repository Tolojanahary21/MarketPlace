import { Module } from '@nestjs/common';
import { ProductService } from './produit.service';
import { ProductController } from './produit.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProduitModule {}
