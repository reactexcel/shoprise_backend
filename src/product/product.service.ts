import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/data-service/entities/product.entity';
import { productAsset } from 'src/data-service/entities/productAsset.entity';
import { In, Repository } from 'typeorm';

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
      ...productData,
    });
    const savedProduct = await this.productRepository.save(product);
    
    await this.addProductAsset(photos,savedProduct.id); //calling product asset method

    return savedProduct
  }
  
  async getProducts(): Promise<Product[]> {   
    return this.productRepository.find({
      relations:{
        photos:true,
      }
    });
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
  
  async filterByCategory(categories: string[]): Promise<Product[]> {
    return await this.productRepository.find({
      where:{
        cat: In(categories)
      },
      relations:{photos:true}
    })
  }

  async favProduct(id:number):Promise<Product>{
    const productData = await this.productRepository.findOne({where:{id}})

    const q1 = `UPDATE product SET favourite = false WHERE id = ?`
    const q2 = `UPDATE product SET favourite = true WHERE id = ?`

    if(productData.favourite) return await this.productRepository.query(q1,[id]) 
    
    return await this.productRepository.query(q2,[id])
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

