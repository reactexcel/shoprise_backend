import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import {User} from '../data-service/entities/user.entity'
// import { DatabaseModule } from './database.module';
// import { UserRepoProvider } from '../providers/userRepo.provider';
// import { ProfileRepoProvider } from '../providers/profileRepo.provider';
// import { AssetsRepoProvider } from '../providers/assetsRepo.provider';
// import { MulterMiddleware } from '../common/middlewares/multer.middleware';
// import { ActivityRepoProvider } from '../providers/activityRepo.provider';

@Module({
    imports: [ConfigModule],
    providers: [AuthService, {
      provide: 'SECRET_KEY',
      useFactory: (configService: ConfigService) => configService.get<string>('SECRET_KEY'),
      inject: [ConfigService],
    }],
    exports: [AuthService],
  })
  export class AuthModule {}
