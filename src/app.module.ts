import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import * as Joi from 'joi';
import { ProductModule } from './product/product.module';
import { BlogModule } from './blog/blog.module';
import { VerifyUserMiddleware } from './common/middleware/verifyUser';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { User } from './data-service/entities/user.entity';
import { ExcludePasswordInterceptor } from './common/interceptors/exludePassword';
import { OrderModule } from './order/order.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VehicleModule } from './vehicle/vehicle.module';
import { RealEstateModule } from './realEstate/realEstate.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { Message } from './data-service/entities/message.entity';
import { BlogScheduler } from './common/schedular/schedular';
import { BlogService } from './blog/blog.service';
import { Blog } from './data-service/entities/blog.entity';
import { BlogAsset } from './data-service/entities/blogAsset.entity';
import { Comment } from './data-service/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([User, Message, Blog, BlogAsset, Comment]),
    DatabaseModule,
    userModule,
    ProductModule,
    BlogModule,
    AuthModule,
    OrderModule,
    VehicleModule,
    RealEstateModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [ChatGateway, AppService, ChatService, BlogScheduler, BlogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyUserMiddleware)
      .exclude(
        { path: 'v1/user/signup', method: RequestMethod.POST },
        { path: 'v1/user/signin', method: RequestMethod.POST },
        { path: 'v1/product/get/all', method: RequestMethod.GET },
        { path: 'v1/product/filter/cats', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'v1/product/add', method: RequestMethod.POST },
        { path: 'v1/vehicle/add', method: RequestMethod.POST },
        { path: 'v1/real-estate/add', method: RequestMethod.POST },
        { path: 'v1/user/update', method: RequestMethod.PUT },
        { path: 'v1/user/get', method: RequestMethod.GET },
        {
          path: 'v1/user/unfollow/:userToUnfollowId',
          method: RequestMethod.DELETE,
        },
        { path: 'v1/user/follow/:userToFollowId', method: RequestMethod.POST },
        { path: 'v1/user/followers', method: RequestMethod.GET },
        { path: 'v1/user/following', method: RequestMethod.GET },
        { path: 'v1/user/chat/connect', method: RequestMethod.POST },
        { path: 'v1/user/send-message', method: RequestMethod.POST },
        { path: 'v1/user/chat/all-receiver-names', method: RequestMethod.GET },
        { path: 'v1/user/chat/:receiverId', method: RequestMethod.GET },
        { path: 'v1/user/update/profile_img', method: RequestMethod.PUT },
        { path: 'v1/user/update/back_img', method: RequestMethod.PUT },
        { path: 'v1/order/place/:id', method: RequestMethod.POST },
        { path: 'v1/blog/post', method: RequestMethod.POST },
        { path: 'v1/blog/add-comment/:id', method: RequestMethod.POST },
        {
          path: 'v1/blog/delete-comment/:commentId',
          method: RequestMethod.DELETE,
        },
      );
  }
}
