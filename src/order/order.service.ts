import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/data-service/entities/order.entity';
import { Product } from 'src/data-service/entities/product.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async placeOrder(order:Order,userId:number,id:number): Promise<Order|null> {
        
        const productData = await this.productRepository.findOne({where:{id}})

        const total:number = this.totalPrice(productData.price,productData.deliveryFee)
        const orderData = this.orderRepository.create({
            userId,
            productId:productData.id,
            total,
            ...order
        })
        return await this.orderRepository.save(orderData)
    }

    async getOrders():Promise<Order[]>{
        return await this.orderRepository.find({
            relations:{
                products:true,
                user:true
            }
        })
    }

    totalPrice(price:string,deliveryFee:string){
        const price1 = parseInt(price.split('$')[1])
        const delFee = parseInt(deliveryFee.split('$')[1])
        return price1+delFee
    }
}
