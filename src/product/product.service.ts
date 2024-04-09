import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/data-service/entities/product.entity';
import { productAsset } from 'src/data-service/entities/productAsset.entity';
import { Repository } from 'typeorm';

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
    const valueStrings = filenames.map(filename => `('${filename}', '${id}')`);
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
    const q = `SELECT product.*, product_asset.url FROM product LEFT JOIN product_asset ON product.id = product_asset.productId WHERE product.id = ${id}`
    const data = await this.productRepository.query(q);
    return data
  }
  
  async filterByCategory(categories: string[]): Promise<Product[]> {
    
    console.log(categories);
    
      const q = `SELECT * FROM product LEFT JOIN product_asset ON product.id = product_asset.productId WHERE cat IN (?)`
      const data = this.productRepository.query(q,[categories])
      return data
      // return await this.productRepository
      // .createQueryBuilder('product')
      // .where(`product.cat IN (:...categories)`, { categories })
      // .leftJoinAndSelect('product.id','product_asset.productId')
      // .getMany();
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

