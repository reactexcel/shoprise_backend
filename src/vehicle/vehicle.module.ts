import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { vehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/data-service/entities/vehicle.entity';
import { VehicleAsset } from 'src/data-service/entities/vehicleAsset.entity';
import { MulterMiddleware } from 'src/common/middleware/multer.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle,VehicleAsset])],
  controllers: [vehicleController],
  providers: [VehicleService],
})
export class VehicleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(
        { path: 'v1/vehicle/add', method: RequestMethod.POST }
        );
  }
}
