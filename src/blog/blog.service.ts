import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Blog} from '../data-service/entities/blog.entity';
import {Multer} from 'multer'
import { BlogAsset } from 'src/data-service/entities/blogAsset.entity';

@Injectable()
export class BlogService{
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogAsset)
    private readonly blogAssetRepository: Repository<BlogAsset>,
  ) {}

  async createBlog(blogData:Blog, files:Multer.File[]): Promise<Blog> {
       const blog =this.blogRepository.create(blogData);
       let newBlog = await this.blogRepository.save(blog)
       const data =  await Promise.all(files.map(async(file) =>{
          const image = await this.blogAssetRepository.save(this.blogAssetRepository.create({imageUrl:file.filename, blogId:newBlog.id}))
          return image
       }))

       newBlog.assets = data
       return newBlog;
  }

  async fetchAll(): Promise<Blog[]> {
    return this.blogRepository.find(
        {
            select:{
                id:true,
                heading:true,
                introduction:true,
                conclusion:true,
                note:true,
                category:true,
                createdAt:true,
                user:{
                    id:true,
                    firstName:true,
                    lastName:true,
                },
                assets:{
                    id:true,
                    imageUrl:true
                }
              },
            relations:['user' , 'assets']
        }
    );
  }

  async fetchById(id:number): Promise<Blog> {
    return this.blogRepository.findOne(
       {
          where:{id},
          select:{
            id:true,
            heading:true,
            introduction:true,
            conclusion:true,
            note:true,
            createdAt:true,
            user:{
                id:true,
                firstName:true,
                lastName:true,
            },
            assets:{
                id:true,
                imageUrl:true
            }
          },
          relations:['user', 'assets']
       });

  }

}