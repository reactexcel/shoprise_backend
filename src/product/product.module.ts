import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/data-service/entities/product.entity';
import { productAsset } from 'src/data-service/entities/productAsset.entity';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { RealEstate } from 'src/data-service/entities/realestate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,productAsset,Vehicle,RealEstate])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(
        { path: 'v1/product/add', method: RequestMethod.POST }
        );
  }
}
