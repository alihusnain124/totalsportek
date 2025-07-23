import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { League } from './entities/league.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, Category])],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}
