import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';

@Injectable()
export class ParamsIntPipe implements PipeTransform<any> {
  keys: string[]
  constructor(keys: string[] = []) {
    this.keys = keys
  }
  async transform(value: {[key:string]: string | number}, metadata: ArgumentMetadata) {
    if (this.keys.length) {
      Object.keys(value).forEach(key => {
        if (this.keys.includes(key)) value[key] = parseInt(String(value[key]))
      })
    } else {
      Object.keys(value).forEach(key => {
        value[key] = parseInt(String(value[key]))
      })
    }
    return value;
  }
}
