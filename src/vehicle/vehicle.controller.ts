import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Response, Request, response } from 'express';
import {Multer} from 'multer'


@Controller('vehicle')
export class vehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('add')
  async addVehicle(@UploadedFile() file:Multer.File[], @Req() req:any,  @Res() response:Response) {
    const {model, brand, year} = req.body
    try {      
      const vehicleData = await this.vehicleService.addVehicle(
        {
        ...req.body,
         title:brand+" "+model+" "+year
        },
        req.files,req.user
      );
      response.status(201).send({success:true, message:'vehicle added successfully', data:vehicleData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  
  @Get('get/all')
  async getVehicles(@Res() response: Response) {
    try {
      const vehicles = await this.vehicleService.getVehicles();
      response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicles});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  
  @Get('get/:id')
  async getVehicle(@Res() response: Response,@Param('id', ParseIntPipe) id:number) {
    try {
      const vehicleData = await this.vehicleService.getVehicle(id);
      response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicleData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
 
//   @Post('filter')
//   async filterByCategory(@Req() req:any, @Res() response: Response) {
//     let vehicleData
//     try {
//       if (req.body.cat.length) {
//           vehicleData = await this.vehicleService.filterByCategory(req.body.cat);
//       } else {
//           vehicleData = await this.vehicleService.getvehicles();
//       }
//       response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicleData});
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
//     }
//   }

  @Put('favourite/:id')
  async favVehicle(@Res() response:Response, @Param('id', ParseIntPipe) id:number){
    try {
      const msg:string = await this.vehicleService.favVehicle(id);      
      response.status(201).send({success:true, message:msg});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @Get('query')
  async queryVehicle(@Req() req:any,@Res() response: Response, @Param('id', ParseIntPipe) id:number) {
    try {
      const vehicleData = await this.vehicleService.queryVehicle(req.body,id,req.user);
      response.status(201).send({success:true, message:'vehicle fetched successfully', data:vehicleData});
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
