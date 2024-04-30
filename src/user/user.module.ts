import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../data-service/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';
import { SellerRating } from 'src/data-service/entities/sellerRating.entity';
import { ChatService } from 'src/chat/chat.service';
import { Message } from 'src/data-service/entities/message.entity';
import { ProductService } from 'src/product/product.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { RealEstateService } from 'src/realEstate/realEstate.service';
import { OrderService } from 'src/order/order.service';
import { Product } from 'src/data-service/entities/product.entity';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { RealEstate } from 'src/data-service/entities/realestate.entity';
import { Order } from 'src/data-service/entities/order.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      SellerRating,
      Message,
      Product,
      Vehicle,
      RealEstate,
      Order,
    ]),
  ],
  controllers: [userController],
  providers: [
    UserService,
    {
      provide: 'SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('SECRET_KEY'),
      inject: [ConfigService],
    },
    OrderService,
    AuthService,
    ChatService,
  ],
  exports: [UserService],
})

// export class userModule {}
export class userModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(
        { path: 'v1/user/update/profile_img', method: RequestMethod.PUT },
        { path: 'v1/user/update/back_img', method: RequestMethod.PUT },
      );
  }
}
