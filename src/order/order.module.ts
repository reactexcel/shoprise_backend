import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/data-service/entities/order.entity';
import { Product } from 'src/data-service/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order,Product])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
