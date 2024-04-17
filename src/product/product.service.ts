import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/data-service/entities/product.entity';
import { productAsset } from 'src/data-service/entities/productAsset.entity';
import { In, Repository } from 'typeorm';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { VehicleAsset } from 'src/data-service/entities/vehicleAsset.entity';
import { RealEstate } from 'src/data-service/entities/realestate.entity';

// @Injectable()
// export class ProductAsset{
//   constructor(
//   @InjectRepository(productAsset)
//     private readonly productAssetRepository: Repository<productAsset>,
//   ) {}

//   async addProductAsset(productAssetData: any[],id:number): Promise<productAsset[]> {
//     for (const item of productAssetData) {
//       const newPhoto = this.productAssetRepository.create(productAssetData);
//       const photo= await this.productAssetRepository.save(productAssetData);
//     }

// }

@Injectable()
export class ProductService { 
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(productAsset)
    private readonly productAssetRepository: Repository<productAsset>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(RealEstate)
    private readonly realEstateRepository: Repository<RealEstate>
  ) {}


  async addProductAsset(urls:{filename:string}[],id:number): Promise<any> {

    const filenames = urls.map(url => url.filename);
    let query = 'INSERT INTO product_asset (url, productId) VALUES ';
    const valueStrings = filenames.map(filename => `('http://116.202.210.102:3000/uploads/${filename}', '${id}')`);
    query += valueStrings.join(', ');

    return this.productAssetRepository.query(query)
  }

  async addProduct(productData: Partial<Product|any>,photos:any,userId:string): Promise<Product>{
    const product = this.productRepository.create({
      userId,
      parentCat:process.env.PARENT_CAT_P,
      ...productData,
    });
    const savedProduct = await this.productRepository.save(product);
    
    await this.addProductAsset(photos,savedProduct.id); //calling product asset method

    return savedProduct
  }
  
  async getProducts(): Promise<any[]> {  
    const items = await this.productRepository.find({
      relations:{
        photos:true,
      }
    }); 
    const vehicle = await this.getVehicles()
    const realEstate = await this.getHomes()
    return [...items,...vehicle,...realEstate]
  }
  
  async getProduct(id:number): Promise<Product> {
    return this.productRepository.findOne({
      where:{id},
      relations:{
        user:true,
        photos:true
      }
    })
  }

  async getVehicles(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      relations:{
        user:true,
        vehicleAsset:true
      }
    })
  }
  async getHomes(): Promise<RealEstate[]> {
    return await this.realEstateRepository.find({
      relations:{
        user:true,
        realEstateAsset:true
      }
    })
  }
  
  async filterByCategory(categories: string[]): Promise<Product[]> {
    // if(categories.includes('vehicle')){
    //   const vehicle = this.findVehicle()
    // }
    return await this.productRepository.find({
      where:{
        cat: In(categories)
      },
      relations:{photos:true}
    })
  }

  async favProduct(id:number):Promise<string>{
    const productData = await this.productRepository.findOne({where:{id}})

    const q1 = `UPDATE product SET favourite = false WHERE id = ?`
    const q2 = `UPDATE product SET favourite = true WHERE id = ?`

    if(productData.favourite){
      await this.productRepository.query(q1,[id])
      return "item removed from the favourite list"
    }else{
      await this.productRepository.query(q2,[id])
      return "item added in the favourite list"
    }
  }

  async queryProduct(message:string,id:number,userId):Promise<string>{
    console.log({
      id,
      message,
      userId
    });
    
    return "inside query product"
  }
}

