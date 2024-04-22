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
  Req,
  Delete,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Response } from 'express';
import { Blog } from '../data-service/entities/blog.entity';
import { ExistenceCheckInterceptor } from '../common/interceptors/isUserExist';
import * as bcrypt from 'bcrypt';
import {
  PASSWORD_RESET,
  SIGNIN_SUCCESSFULLY,
  SIGNUP_SUCCESSFULLY,
} from '../common/constants/response';
import {
  E_PASSWORD_NOT_MATCHED,
  E_USER_NOT_FOUND,
} from 'src/common/constants/exception';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Multer } from 'multer';
// import { CustomRequest } from 'src/common/middleware/verifyUser';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('post')
  async postBlog(@Req() req: any, @Res() response: Response) {
    try {
      const blogData = await this.blogService.createBlog(
        req.body,
        req.files,
        req.user,
      );
      response.status(201).send({ success: true, data: blogData });
    } catch (error) {
      console.log(error, 'errrr');
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('blogs')
  async getBlogs(@Res() response: Response) {
    try {
      const blogs = await this.blogService.fetchAll();
      response.status(200).send({ success: true, data: blogs });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('draft/:id')
  async getDraftBlog(@Res() response: Response) {
    try {
      const blogs = await this.blogService.getDraftBlog;
      response.status(200).send({ success: true, data: blogs });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get/:id')
  async getBlog(@Param() blogId, @Res() response: Response) {
    const { id } = blogId;
    try {
      const blog = await this.blogService.fetchById(+id);
      response.status(200).send({ success: true, blog });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('add-comment/:id')
  async postComment(
    @Param() blogId,
    @Req() req: any,
    @Res() response: Response,
  ) {
    try {
      const blog = await this.blogService.fetchById(+blogId.id);
      if (blog.commentStatus !== true) {
        return response
          .status(400)
          .send({ success: false, message: 'Comment Disabled for this post' });
      }
      const commentData = await this.blogService.createComment(
        +blogId.id,
        req.body,
        req.user,
      );
      response
        .status(201)
        .send({ success: true, data: commentData, message: 'Comment Added' });
    } catch (error) {
      console.log(error, 'errrr');
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete('delete-comment/:commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Req() req: any,
    @Res() response: Response,
  ) {
    try {
      const userId = req.user.id;

      const comment = await this.blogService.getCommentById(commentId);

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      if (comment.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this comment',
        );
      }

      await this.blogService.deleteComment(commentId);

      response.status(200).send({ success: true, message: 'Comment Deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
