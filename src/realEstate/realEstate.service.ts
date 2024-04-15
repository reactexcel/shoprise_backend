import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RealEstate } from 'src/data-service/entities/realestate.entity';
import { RealEstateAsset } from 'src/data-service/entities/realestateAsset.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RealEstateService { 
  constructor(
    @InjectRepository(RealEstate)
    private readonly realEstateRepository: Repository<RealEstate>,
    @InjectRepository(RealEstateAsset)
    private readonly realEstateAssetRepository: Repository<RealEstateAsset>,
  ) {}

  async addRealEstateAsset(urls:{filename:string}[],id:number): Promise<any> {

    const filenames = urls.map(url => url.filename);
    let query = 'INSERT INTO real_estate_asset (url, realEstateId) VALUES ';
    const valueStrings = filenames.map(filename => `('http://116.202.210.102:3000/uploads/${filename}', '${id}')`);
    query += valueStrings.join(', ');

    return this.realEstateAssetRepository.query(query)
  }

  async addRealEstate(realEstateData: Partial<RealEstate|any>,photos:any,userId:string): Promise<RealEstate>{
    const vehicle = this.realEstateRepository.create({
      userId,
      parentCat:process.env.PARENT_CAT_H,
      ...realEstateData,
    });
    const savedvehicle = await this.realEstateRepository.save(vehicle);
    
    await this.addRealEstateAsset(photos,savedvehicle.id); //calling vehicle asset method

    return savedvehicle
  }
  
  async getRealEstates(): Promise<RealEstate[]> {   
    return this.realEstateRepository.find({
      relations:{
        realEstateAsset:true,
      }
    });
  }
  
  async getRealEstate(id:number): Promise<RealEstate> {
    return this.realEstateRepository.findOne({
      where:{id},
      relations:{
        user:true,
        realEstateAsset:true
      }
    })
  }

  async favRealEstate(id:number):Promise<string>{
    const vehicleData = await this.realEstateRepository.findOne({where:{id}})

    const q1 = `UPDATE vehicle SET favourite = false WHERE id = ?`
    const q2 = `UPDATE vehicle SET favourite = true WHERE id = ?`

    if(vehicleData.favourite){
      await this.realEstateRepository.query(q1,[id])
      return "item removed from the favourite list"
    }else{
      await this.realEstateRepository.query(q2,[id])
      return "item added in the favourite list"
    }
  }
}

