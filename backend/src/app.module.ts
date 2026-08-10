import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/dto/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ClientService } from './client/client.service';
import { ClientModule } from './client/client.module';
import { SupplierService } from './supplier/supplier.service';
import { SupplierModule } from './supplier/supplier.module';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';
import { VerticalService } from './vertical/vertical.service';
import { VerticalModule } from './vertical/vertical.module';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { ProductService } from './produit/produit.service';
import { ProduitModule } from './produit/produit.module';
import { ImageService } from './image/image.service';
import { ImageModule } from './image/image.module';
import { QuoteService } from './quote/quote.service';
import { QuoteModule } from './quote/quote.module';

import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseOrderService } from './purchase/purchase.service';

import { PoitemsModule } from './poitems/poitems.module';
import { POItemService } from './poitems/poitems.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    SupplierModule,
    AddressModule,
    VerticalModule,
    CategoryModule,
    ProduitModule,
    ImageModule,
    QuoteModule,
    PurchaseModule,
    PoitemsModule,
  ],
  providers: [ClientService, SupplierService, AddressService, VerticalService, CategoryService, ProductService, ImageService, QuoteService, PurchaseOrderService, POItemService],
})
export class AppModule {}
