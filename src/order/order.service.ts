import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/data-service/entities/order.entity';
import { Product } from 'src/data-service/entities/product.entity';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { RealEstate } from 'src/data-service/entities/realestate.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,

        @InjectRepository(RealEstate)
        private readonly realEsateRepository: Repository<RealEstate>,
    ) {}

    async placeOrder(order:any,userId:number,id:number): Promise<any> {
        const{parentCat} = order;
        let data;
        if(parentCat === 'product'){
            data = await this.productRepository.findOne({where:{id}})
        }
        else if(parentCat === 'vehicle'){
            data = await this.vehicleRepository.findOne({where:{id}})
        }
        else{
            data = await this.realEsateRepository.findOne({where:{id}})
        }

        const orderData = this.orderRepository.create({
            productId:parentCat === 'product' ? data.id : null,
            vehicleId:parentCat === 'vehicle' ? data.id : null,
            realEstateId:parentCat === 'real-estate' ? data.id : null,
            ...order,
            buyerId:2,
        })
        return await this.orderRepository.save(orderData)
    }

    async getOrders():Promise<Order[]>{
        return await this.orderRepository.find({
            // select:{
            //  id:true,
            //  address:true,
            //  offerApplied:true,
            //  fulfilment:true,
            //  status:true,
            //  createdAt:true,
            //  product:{
            //     title:true,
            //     photos:true,
            //     user:{
            //         firstName:true,
            //         lastName:true,
            //         profilePhoto:true
            //     }
            //  }
            // },
            relations:{
                product:{
                    user:true
                },
                vehicle:{
                    user:true
                },
                realEstate:{
                    user:true
                },
                buyer:true,
            }
        })
    }
}
