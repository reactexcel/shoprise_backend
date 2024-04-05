import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'express';
import { Product } from 'src/data-service/entities/product.entity';
import {Multer} from 'multer'


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  async addProduct(@UploadedFile() file:Multer.File[], @Req() req:any,  @Res() response:Response) {
    try {      
      const productData = await this.productService.addProduct(req.body,req.files);

      response.status(201).send({success:true, message:'product added successfully', data:productData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('get/all')
  async getProducts(@Res() response: Response) {
    try {
      const products = await this.productService.getProducts();
      response.status(201).send({success:true, message:'product fetched successfully', data:products});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
