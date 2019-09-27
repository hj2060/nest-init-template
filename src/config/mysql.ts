import { TypeOrmModuleOptions } from "@nestjs/typeorm"
const MysqlConfig: {[key: string] :TypeOrmModuleOptions} = {
  production: {
    type: 'mysql',
    host: '118.89.249.132',
    username: 'root',
    password: 'arron1990',
    database: 'personal',
    entities: [process.cwd() + '/dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    charset: 'utf8mb4'
  }
}
export default MysqlConfig[process.env.NODE_ENV]
