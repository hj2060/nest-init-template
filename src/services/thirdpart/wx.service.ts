import { Injectable } from '@nestjs/common';
import axios from 'axios'
import { UtilsService } from '../common/utils.service';
import WxDecode from './wxDecodeUser.js'
import cache = require('memory-cache')
@Injectable()
export class WxService {
  private readonly http = axios.create({
    baseURL: 'https://api.weixin.qq.com'
  })
  private readonly APPID = 'wx2e353fbdb44499e8'
  private readonly SECRET = '24039c1f92ec124954793b1038b57389'
  // 商户号
  private readonly MCH_ID = '1499876842'
  // 商户秘钥
  private readonly MCH_KEY = 'hendongnikeji2016dedongniMBA2018'
  // 支付成功的回调地址
  private readonly notify_url = 'http://api.mba.hendongni.com/app/order/notify'

  constructor(
    private readonly utils: UtilsService
  ) {}

  // 微信支付签名
  private getPaySign(params: Object, key: string) {
    const strArr = []
    Object.keys(params).sort().forEach(key => {
      if (params[key]) {
        strArr.push(`${key}=${params[key]}`)
      }
    })
    strArr.push(`key=${key}`)
    return this.utils.md5(strArr.join('&')).toUpperCase()
  }

  // 获取预下单签名参数
  private getPayParams(openid: string, ip: string, price: number, out_trade_no: string) {
    const siginParams = {
      appid: this.APPID,
      mch_id: this.MCH_ID,
      device_info: 'APP',
      nonce_str: this.utils.md5(String(Math.random())),
      sign_type: 'MD5',
      openid,
      spbill_create_ip: ip,
      body: '很懂你MBA-教程购买', // 一般为 商家名称-商品类目
      out_trade_no: out_trade_no, // 商户订单号 时间+用户id+教程id
      total_fee: price,
      notify_url: this.notify_url,
      trade_type: 'JSAPI',
      sign: ''
    }
    siginParams.sign = this.getPaySign(siginParams, this.MCH_KEY)
    return this.utils.xmlEncode(siginParams)
  }

  // 根据code 获取 session_key 和 open_id
  public getOpenid(code: string) {
    return this.http(`/sns/jscode2session?appid=${this.APPID}&secret=${this.SECRET}&js_code=${code}&grant_type=authorization_code`)
  }

  // 小程序预付单接口 返回{res: 接口调用成功返回, payParams: 供小程序发起支付}
  public async prevPay(params: {openid: string, ip: string, price: number, out_trade_no: string}) {
    const {openid, ip, price, out_trade_no} = params
    const paySign = this.getPayParams(openid, ip, price, out_trade_no)
    return this.http.post('https://api.mch.weixin.qq.com/pay/unifiedorder', paySign).then(async res => {
      const result: any = await this.utils.xmlDecode(res.data)
      const formate: any = {}
      Object.keys(result.xml).forEach(key => {
        formate[key] = result.xml[key][0]
      })
      // 小程序支付参数
      const payParams = {
        appId: this.APPID,
        timeStamp: String(Date.now() / 1000),
        nonceStr: this.utils.md5(String(Math.random())),
        package: 'prepay_id=' + formate.prepay_id,
        signType: 'MD5',
        paySign: ''
      }
      payParams.paySign = this.getPaySign(payParams, this.MCH_KEY)
      delete payParams.appId
      return {res: formate, payParams}
    })
  }

  // 获取微信手机号
  public getWxMobile(encryptedData: string, iv: string, sessionKey: string) {
    const pc = new WxDecode(this.APPID, sessionKey)
    return pc.decryptData(encryptedData, iv)
  }

  public async getAccessToken() {
    const access_token = await cache.get('access_token')
    if (!access_token) {
      const res = await this.http(`/cgi-bin/token?grant_type=client_credential&appid=${this.APPID}&secret=${this.SECRET}`)
      if (res && res.data.access_token) {
        cache.put('access_token', res.data.access_token, 7000 * 1000)
        return res.data.access_token
      } else {
        throw new Error('获取access_token失败')
      }
    }
    return access_token
  }

  // 获取二维码
  public async getQrcode(path: string, scene: string) {
    const access_token = await this.getAccessToken()
    return this.http.post(`/wxa/getwxacodeunlimit?access_token=${access_token}`, {
      page: path,
      scene
    }, {responseType: 'arraybuffer'})
  }
}

