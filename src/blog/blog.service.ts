import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Blog} from '../data-service/entities/blog.entity';
import {Multer} from 'multer'
import { BlogAsset } from 'src/data-service/entities/blogAsset.entity';
import * as moment from 'moment'

@Injectable()
export class BlogService{
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogAsset)
    private readonly blogAssetRepository: Repository<BlogAsset>,
  ) {}

  async createBlog(blogData:Blog, files:Multer.File[], user:any): Promise<Blog> {
       const blog =this.blogRepository.create({...blogData, userId:user.id});
       let newBlog = await this.blogRepository.save(blog)
       if(files){
         const data = await Promise.all(files.map(async(file) =>{
               return await this.blogAssetRepository
               .save(
                this.blogAssetRepository
                .create({
                  imageUrl:`http://116.202.210.102:3000/uploads/${file.filename}`,
                   blogId:newBlog.id
                  })
                )
         }))
         newBlog.photos  = data
       }
       return newBlog;
  }

  async fetchAll(): Promise<Blog[]> {
    return this.blogRepository.find(
        {
            relations:['user' , 'photos'],
            where:{status:"published"}
        }
    );
  }

  async fetchById(id:number): Promise<Blog> {
    return this.blogRepository.findOne(
       {
          where:{id},
          relations:['user', 'assets']
       });

  }

  async getDraftBlog(): Promise<Blog> {
    const draftBlog =  await this.blogRepository.findOne({
      where: {
        status:'draft'
      },
    });
    return draftBlog
  }

  async getScheduledBlog(): Promise<Blog[]> {
    const date = moment(new Date());
    const formatedDate = date.format("YYYY-MM-DD HH:mm")
    const pendingTasks =  await this.blogRepository.find({
      where: {
        scheduledDate: formatedDate,
        status:'pending'
      },
    });
    return pendingTasks
  }

  async updateBlog(blogId:number, blogData:Partial<Blog>):Promise<Blog>{
     const blog = await this.blogRepository.findOne({where:{id:blogId}})
     const newBlog = this.blogRepository.merge(blog, blogData)
     return await this.blogRepository.save(newBlog);
  }

}