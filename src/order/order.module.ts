import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/data-service/entities/order.entity';
import { Product } from 'src/data-service/entities/product.entity';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { RealEstate } from 'src/data-service/entities/realestate.entity';
import { ProductService } from 'src/product/product.service';
import { productAsset } from 'src/data-service/entities/productAsset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      productAsset,
      Vehicle,
      RealEstate,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService],
})
export class OrderModule {}
