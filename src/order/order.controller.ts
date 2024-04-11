import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('place/:id')
    async addProduct(@Req() req:any,  @Res() response:Response, @Param('id', ParseIntPipe) id:number) {
      try {        
        const productData = await this.orderService.placeOrder(req.body,req.user.id,id);
        response.status(201).send({success:true, message:'order placed successfully', data:productData});
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Get('get/all')
    async getProducts(@Req() req:any,  @Res() response:Response) {
      try {        
        const productData = await this.orderService.getOrders();
        response.status(201).send({success:true, message:'orders fetched successfully', data:productData});
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}
