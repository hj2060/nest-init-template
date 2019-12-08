import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';
import { User } from '../../model/user.entity';

@Injectable()
export class EntityService {
  constructor(
    private readonly connection: Connection
  ) {}
  // 事务处理回调
  async transaction<T = any>(cb: (query: QueryRunner) => T): Promise<T> {
    const query = this.connection.createQueryRunner()
    await query.connect()
    await query.startTransaction()
    let res:T = null
    try {
      res = await cb(query)
      await query.commitTransaction()
    } catch (e) {
      await query.rollbackTransaction()
      throw e
    } finally {
      await query.release()
    }
    return res
  }
  get user() {
    return this.connection.getRepository(User)
  }
}
