import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export default class AdminSeeder implements Seeder {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor() {}

  public async run(dataSource: DataSource): Promise<void> {
    try {
      await dataSource.transaction(async (manager) => {
        let adminUser = await manager.findOne(User, { where: { email: 'admin@gmail.com' } });
        if (!adminUser) {
          adminUser = manager.create(User, {
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'Admin@123',
          });
          await manager.save(User, adminUser);
          this.logger.log(`Admin user ${adminUser.email} created`);
        } else {
          this.logger.log(`Admin user ${adminUser.email} already exists`);
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
