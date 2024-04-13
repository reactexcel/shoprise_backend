import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userController } from './user.controller';
import { UserService } from './user.service';
import {User} from '../data-service/entities/user.entity'
import { AuthService } from 'src/auth/auth.service';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';
// import { DatabaseModule } from './database.module';
// import { UserRepoProvider } from '../providers/userRepo.provider';
// import { ProfileRepoProvider } from '../providers/profileRepo.provider';
// import { AssetsRepoProvider } from '../providers/assetsRepo.provider';
// import { MulterMiddleware } from '../common/middlewares/multer.middleware';
// import { ActivityRepoProvider } from '../providers/activityRepo.provider';

@Module({
  imports: [ConfigModule ,TypeOrmModule.forFeature([User])],
  controllers:[userController],
  providers:[
    // ...UserRepoProvider,
    // ...ProfileRepoProvider,
    // ...AssetsRepoProvider,
    // ...ActivityRepoProvider,
    UserService,
    {
      provide: 'SECRET_KEY',
      useFactory: (configService: ConfigService) => configService.get<string>('SECRET_KEY'),
      inject: [ConfigService],
    },
    AuthService
],
  exports:[
    // ...UserRepoProvider,
    // ...ProfileRepoProvider,
    // ...AssetsRepoProvider,
    // ...ActivityRepoProvider,
    UserService
]
})

// export class userModule {}
export class userModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(
        { path: 'v1/user/update/profile_img', method: RequestMethod.PUT },
        { path: 'v1/user/update/back_img', method: RequestMethod.PUT }
        );
  }
}