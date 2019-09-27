import { Injectable } from '@nestjs/common';
import qiniu = require('qiniu')
import cache = require('memory-cache')
@Injectable()
export class QiniuService {
  private readonly AK = ''
  private readonly SK = ''
  private readonly mac = new qiniu.auth.digest.Mac(this.AK, this.SK)

  /**
   * 获取js sdk上传token
   * @param {*} bucket 存储空间名称
   */
  async getToken(bucket: 'media' | 'image') {
    const cacheName = bucket + 'Token'
    const token = cache.get(cacheName)
    if (!token) {
      const options = {
        scope: bucket,
        // scope: bucket + ":" + 文件名可覆盖上传(test.mp4)
        expires: 3600 * 12 * 7
      }
      const putPolicy = new qiniu.rs.PutPolicy(options)
      const uploadToken = putPolicy.uploadToken(this.mac)
      cache.put(cacheName, uploadToken, 60 * 3600 * 1000 * 7)
      return uploadToken
    } else {
      return token
    }
  }
}
