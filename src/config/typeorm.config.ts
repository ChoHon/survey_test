import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'survey.cbwgpo4srmnh.ap-northeast-2.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: 'survey1234',
  database: 'survey',
  synchronize: true,
  entities: [__dirname + '/../**/entities/**.entity{.ts,.js}'],
};
