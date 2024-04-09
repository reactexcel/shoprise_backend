import { Module , NestModule, MiddlewareConsumer, RequestMethod,} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service'
import { userModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import * as Joi from 'joi'
import { ProductModule } from './product/product.module';
import { BlogModule } from './blog/blog.module';
import { VerifyUserMiddleware } from './common/middleware/verifyUser';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { User } from './data-service/entities/user.entity';
import { ExcludePasswordInterceptor } from './common/interceptors/exludePassword';

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
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    userModule,
    ProductModule,
    BlogModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyUserMiddleware)
    .exclude(
      { path: 'v1/user/signup', method: RequestMethod.POST },
      { path: 'v1/user/signin', method: RequestMethod.POST },
      { path: 'v1/product/get/all', method: RequestMethod.GET },
      { path: 'v1/product/filter/cats', method: RequestMethod.GET }
    ) 
    .forRoutes('*');
  }
}