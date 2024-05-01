import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { ProductService } from 'src/product/product.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Post('place/:id')
  async addProduct(
    @Req() req: any,
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const productData = await this.orderService.placeOrder(
        req.body,
        req.user.id,
        id,
      );
      response.status(201).send({
        success: true,
        message: 'order placed successfully',
        data: productData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get/all')
  async getProducts(@Req() req: any, @Res() response: Response) {
    try {
      const productData = await this.orderService.getOrders();
      response.status(201).send({
        success: true,
        message: 'orders fetched successfully',
        data: productData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:orderId/update-status/:action')
  async updateStatus(
    @Req() req: any,
    @Res() response: Response,
    @Param('action') action: string,
    @Param('orderId') orderId: number,
  ) {
    try {
      const ordertStatus = await this.orderService.updateStatus(
        orderId,
        action,
      );
      response.status(200).send({
        success: true,
        message: 'order status updated successfully',
        data: ordertStatus,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_MODIFIED);
    }
  }

  @Get('purchasing-items')
  async getPurchasing(@Req() req: any, @Res() response: Response) {
    try {
      const productData = await this.orderService.getPurchasing(req.user.id);
      response.status(201).send({
        success: true,
        message: 'pruchasing orders fetched successfully',
        data: productData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('selling-items')
  async getSellingItems(@Req() req: any, @Res() response: Response) {
    try {
      const productData = await this.orderService.getSellingItems(req.user.id);
      response.status(201).send({
        success: true,
        message: 'selleing orders fetched successfully',
        data: productData,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
