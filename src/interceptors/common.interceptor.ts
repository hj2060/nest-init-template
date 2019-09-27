import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Response} from 'express'
@Injectable()
export class CommonInterceptor implements NestInterceptor {
  constructor(
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res:Response = context.switchToHttp().getResponse()
    return next
      .handle()
      .pipe(
        map(data => {
          if (typeof data === 'string') {
            res.statusCode = 500
            return {
              code: 1,
              errmsg: data
            }
          } else {
            return data
          }
        }),
        catchError((err: Error) => {
          res.statusCode = 500
          return of({
            code: 1,
            errmsg: err.message
          })
        })
      );
  }
}
