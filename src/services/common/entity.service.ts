import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../../model/user.entity';

@Injectable()
export class EntityService {
  constructor(
    private readonly connection: Connection
  ) {}
  get user() {
    return this.connection.getRepository(User)
  }
}
