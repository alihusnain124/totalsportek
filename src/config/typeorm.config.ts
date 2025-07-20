import { DataSource } from 'typeorm';
import databaseConfig from './database.config';
import { ConfigService } from '@nestjs/config';

const dataSourceOptions = databaseConfig(new ConfigService());
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
