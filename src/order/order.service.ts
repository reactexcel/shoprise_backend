import { Injectable } from '@nestjs/common';
import { Order } from 'src/data-service/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly productRepository: Repository<Order>,
    ) {}
}
