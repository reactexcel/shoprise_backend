import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RealEstateService } from './realEstate.service';
import { RealEstateController } from './realEstate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';
import { RealEstate } from 'src/data-service/entities/realestate.entity';
import { RealEstateAsset } from 'src/data-service/entities/realestateAsset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealEstate,RealEstateAsset])],
  controllers: [RealEstateController],
  providers: [RealEstateService],
})
export class RealEstateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(
        { path: 'v1/real-estate/add', method: RequestMethod.POST }
        );
  }
}
