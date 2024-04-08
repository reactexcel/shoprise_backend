import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';
import {Blog} from '../data-service/entities/blog.entity'
import { BlogAsset } from 'src/data-service/entities/blogAsset.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Blog, BlogAsset])],
  controllers:[BlogController],
  providers:[BlogService],
  exports:[]
})

export class BlogModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(MulterMiddleware)
          .forRoutes(
            { path: 'v1/blog/post', method: RequestMethod.POST }
            );
      }
}
