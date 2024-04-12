import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response,Request, response } from 'express';
import { Product } from 'src/data-service/entities/product.entity';
import {Multer} from 'multer'


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  async addProduct(@UploadedFile() file:Multer.File[], @Req() req:any,  @Res() response:Response) {
    try {      
      const productData = await this.productService.addProduct(req.body,req.files,req.user);

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
  
  @Get('get/:id')
  async getProduct(@Res() response: Response,@Param('id', ParseIntPipe) id:number) {
    try {
      const productData = await this.productService.getProduct(id);
      response.status(201).send({success:true, message:'product fetched successfully', data:productData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 
  @Get('filter')
  async filterByCategory(@Req() req:any, @Res() response: Response) {
    let productData
    try {
      if (req.body.cat.length) {
          productData = await this.productService.filterByCategory(req.body.cat);
      } else {
          productData = await this.productService.getProducts();
      }
      response.status(201).send({success:true, message:'product fetched successfully', data:productData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('favourite/:id')
  async favProduct(@Res() response:Response, @Param('id', ParseIntPipe) id:number){
    try {
      const productData = await this.productService.favProduct(id);
      response.status(201).send({success:true, message:'product fetched successfully', data:productData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('query')
  async queryProduct(@Req() req:any,@Res() response: Response, @Param('id', ParseIntPipe) id:number) {
    try {
      const productData = await this.productService.queryProduct(req.body,id,req.user);
      response.status(201).send({success:true, message:'product fetched successfully', data:productData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
