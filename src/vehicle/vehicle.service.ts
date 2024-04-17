import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { VehicleAsset } from 'src/data-service/entities/vehicleAsset.entity';
import { In, Repository } from 'typeorm';

// @Injectable()
// export class vehicleAsset{
//   constructor(
//   @InjectRepository(vehicleAsset)
//     private readonly vehicleAssetRepository: Repository<vehicleAsset>,
//   ) {}

//   async addvehicleAsset(vehicleAssetData: any[],id:number): Promise<vehicleAsset[]> {
//     for (const item of vehicleAssetData) {
//       const newPhoto = this.vehicleAssetRepository.create(vehicleAssetData);
//       const photo= await this.vehicleAssetRepository.save(vehicleAssetData);
//     }

// }

@Injectable()
export class VehicleService { 
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleAsset)
    private readonly vehicleAssetRepository: Repository<VehicleAsset>,
  ) {}

  async addVehicleAsset(urls:{filename:string}[],id:number): Promise<any> {

    const filenames = urls.map(url => url.filename);
    let query = 'INSERT INTO vehicle_asset (url, vehicleId) VALUES ';
    const valueStrings = filenames.map(filename => `('http://116.202.210.102:3000/uploads/${filename}', '${id}')`);
    query += valueStrings.join(', ');

    return this.vehicleAssetRepository.query(query)
  }

  async addVehicle(vehicleData: Partial<Vehicle|any>,photos:any,userId:string): Promise<Vehicle>{
    const vehicle = this.vehicleRepository.create({
      userId,
      cat:process.env.PARENT_CAT_V,
      ...vehicleData,
    });
    const savedvehicle = await this.vehicleRepository.save(vehicle);
    
    await this.addVehicleAsset(photos,savedvehicle.id); //calling vehicle asset method

    return savedvehicle
  }
  
  async getVehicles(): Promise<Vehicle[]> {   
    return this.vehicleRepository.find({
      relations:{
        photos:true,
      }
    });
  }
  
  async getVehicle(id:number): Promise<Vehicle> {
    return this.vehicleRepository.findOne({
      where:{id},
      relations:{
        user:true,
        photos:true
      }
    })
  }
  
//   async filterByCategory(categories: string[]): Promise<Vehicle[]> {
//     return await this.vehicleRepository.find({
//       where:{
//         cat: In(categories)
//       },
//       relations:{vehicleAsset:true}
//     })
//   }

  async favVehicle(id:number):Promise<string>{
    const vehicleData = await this.vehicleRepository.findOne({where:{id}})

    const q1 = `UPDATE vehicle SET favourite = false WHERE id = ?`
    const q2 = `UPDATE vehicle SET favourite = true WHERE id = ?`

    if(vehicleData.favourite){
      await this.vehicleRepository.query(q1,[id])
      return "item removed from the favourite list"
    }else{
      await this.vehicleRepository.query(q2,[id])
      return "item added in the favourite list"
    }
  }

  async queryVehicle(message:string,id:number,userId):Promise<string>{
    console.log({
      id,
      message,
      userId
    });
    
    return "inside query vehicle"
  }
}

