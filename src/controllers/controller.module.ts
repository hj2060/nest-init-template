import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { ServiceModule } from '../services/service.module';
@Module({
  imports: [
    ServiceModule
  ],
  controllers: [
    CommonController
  ]
})
export class ControllerModule {}
