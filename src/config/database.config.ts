import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

export default (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: ['src/**/*.entity{.ts,.js}'],
  // migrations: ['dist/database/migrations/*{.ts,.js}'],
  // migrations: ['src/database/migrations/*{.ts,.js}'],
  migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
  synchronize: false,
  ssl: process.env.NODE_ENV === 'dev' ? false : { rejectUnauthorized: false },
});
