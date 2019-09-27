import { Module, Provider } from '@nestjs/common';
import { UtilsService } from './common/utils.service';
import { EntityService } from './common/entity.service';
const services: Provider[] = [
  UtilsService,
  EntityService
]
@Module({
  exports: services,
  providers: services
})
export class ServiceModule {}
