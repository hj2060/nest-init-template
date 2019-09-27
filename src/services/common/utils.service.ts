import { Injectable } from '@nestjs/common';
import xml2js from 'xml2js'
import { jwt_client_secret } from '../../config/secret';
import jwt = require('jsonwebtoken');
import * as crypto from 'crypto'
import * as dayjs from 'dayjs'
import { Connection } from 'typeorm';
@Injectable()
export class UtilsService {
  constructor(
    private readonly connection: Connection
  ) {}

  dayjs(time?: string | number | Date) {
    return dayjs(time)
  }

  md5(key: string) {
    return crypto.createHash('md5').update(key).digest('hex')
  }

  jwt_decode<T = any>(token: string):Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwt_client_secret, (err: any, decoeded: T) => {
        if (err) {
          reject('invalid token')
        } else {
          resolve(decoeded)
        }
      })
    })
  }

  // 编码token
  jwt_encode(params: any, expiresIn = 24 * 3600 * 30 * 12):Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(params, jwt_client_secret, {expiresIn}, (err:any, token: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }
  // 获取随机数
  random(min: number, max: number) {
    return min + Math.floor((max - min) * Math.random()) + 1
  }
  // xml解码
  xmlDecode(xml: string) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, {trim: true}, function(err:any, result:any) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
  // xml编码
  xmlEncode(json:any = {}) {
    const builder = new xml2js.Builder()
    return builder.buildObject(json)
  }
  trim(str: string, indtifi: string) {
    const regex = new RegExp(`^${indtifi}|${indtifi}$`, 'g')
    return str.replace(regex, '')
  }
  escape2Html(str: string) {
    const arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
      return arrEntities[t]
    })
  }
}
