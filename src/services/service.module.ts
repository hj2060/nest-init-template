import { Module, Provider } from '@nestjs/common';
import { UtilsService } from './common/utils.service';
const services: Provider[] = [
  UtilsService
]
@Module({
  exports: services,
  providers: services
})
export class ServiceModule {}
