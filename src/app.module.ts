import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerModule } from './controllers/controller.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import mysql from './config/mysql';
import { CommonInterceptor } from './interceptors/common.interceptor';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...mysql
    }),
    ControllerModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CommonInterceptor
    }
  ],
})
export class AppModule {}
