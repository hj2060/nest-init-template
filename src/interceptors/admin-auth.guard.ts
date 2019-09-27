import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import jwt = require('jsonwebtoken')
import { jwt_admin_secret } from '../config/secret';
import { Reflector } from '@nestjs/core';
const exception = new HttpException({
  code: 1,
  errmsg: 'invalid token'
}, 401)

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization
    const disableCheck = this.reflect.get<boolean>('disableCheck', context.getHandler())
    if (disableCheck) {
      return true
    }
    if (!token) {
      throw exception
    } else {
      return new Promise((resolve, reject) => {
        jwt.verify(token, jwt_admin_secret, (err: any) => {
          if (err) {
            reject(exception)
          } else {
            resolve(true)
          }
        })
      })
    }
  }
}
