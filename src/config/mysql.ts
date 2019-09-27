import { TypeOrmModuleOptions } from "@nestjs/typeorm"
const MysqlConfig: {[key: string] :TypeOrmModuleOptions} = {
  production: {
    type: 'mysql',
    host: '',
    username: '',
    password: '',
    database: '',
    entities: [process.cwd() + '/dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    charset: 'utf8mb4'
  }
}
export default MysqlConfig[process.env.NODE_ENV]
