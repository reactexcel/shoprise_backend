import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service'
import { userModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import * as Joi from 'joi'
import { ProductModule } from './product/product.module';

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
    DatabaseModule,
    userModule,
   ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
