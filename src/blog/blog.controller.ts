import { 
    Controller, 
    Post, 
    Body, 
    Res, 
    HttpException, 
    HttpStatus, 
    UseInterceptors, 
    Put, 
    ValidationPipe, 
    UsePipes, 
    Param, 
    Get,
    UploadedFiles,
    Req
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Response } from 'express';
import {Blog} from '../data-service/entities/blog.entity'
import { ExistenceCheckInterceptor } from '../common/interceptors/isUserExist';
import * as bcrypt from 'bcrypt'
import { PASSWORD_RESET, SIGNIN_SUCCESSFULLY, SIGNUP_SUCCESSFULLY } from '../common/constants/response';
import { E_PASSWORD_NOT_MATCHED, E_USER_NOT_FOUND } from 'src/common/constants/exception';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {Multer} from 'multer'
import { CustomRequest } from 'src/common/middleware/verifyUser';

@Controller('blog')
@ApiTags('user')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    ) {}


   @Post('post')
    async postBlog(@Body() createBlogDto:Blog, @Req() req:CustomRequest, @UploadedFiles() assets:Multer.File[], @Res() response:Response){
        try{ 
          const blogData = await this.blogService.createBlog({...createBlogDto , userId:req.user.id}, assets);
          response.status(201).send({success:true, data:blogData})
        }catch(error){
          if(error instanceof HttpException) throw error;
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get('blogs')
    async getBlogs(@Res() response:Response){
        try{
            const blogs = await this.blogService.fetchAll()
            response.status(200).send({success:true,data:blogs,})    
        }catch(error){
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('get/:id')
    async getBlog(@Param() blogId, @Res() response:Response){
        const {id} = blogId
        try {
            const blog = await this.blogService.fetchById(+id);
            response.status(200).send({success:true , blog})
        } catch (error) {
            if(error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}