import { Module } from '@nestjs/common';
import { CategoriesEventService } from './categories-event.service';
import { CategoriesEventController } from './categories-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEvent } from './entities/categories-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEvent])],
  controllers: [CategoriesEventController],
  providers: [CategoriesEventService],
  exports: [CategoriesEventService],
})
export class CategoriesEventModule {}
