import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile } from '@nestjs/common';
import { RealEstateService } from './realEstate.service';
import { Response, Request, response } from 'express';
import {Multer} from 'multer'


@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Post('add')
  async addRealEstate(@UploadedFile() file:Multer.File[], @Req() req:any,  @Res() response:Response) {
    try {      
      const vehicleData = await this.realEstateService.addRealEstate(req.body,req.files,req.user);

      response.status(201).send({success:true, message:'Home added successfully', data:vehicleData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  
  @Get('get/all')
  async getRealEstates(@Res() response: Response) {
    try {
      const vehicles = await this.realEstateService.getRealEstates();
      response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicles});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  
  @Get('get/:id')
  async getRealEstate(@Res() response: Response,@Param('id', ParseIntPipe) id:number) {
    try {
      const vehicleData = await this.realEstateService.getRealEstate(id);
      response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicleData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put('favourite/:id')
  async favRealEstate(@Res() response:Response, @Param('id', ParseIntPipe) id:number){
    try {
      const msg:string = await this.realEstateService.favRealEstate(id);      
      response.status(201).send({success:true, message:msg});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
