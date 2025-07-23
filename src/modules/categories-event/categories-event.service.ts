import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriesEventDto } from './dto/create-categories-event.dto';
import { DataSource, Repository } from 'typeorm';
import { EventTeam } from './entities/event-team.entity';
import { CategoriesEvent } from './entities/categories-event.entity';
import { Team } from '../teams/entities/team.entity';
import { League } from '../leagues/entities/league.entity';
import { Category } from '../categories/entities/category.entity';
import { IdDTO } from '../categories/dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesEventService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CategoriesEvent) private readonly categoriesEventRepository: Repository<CategoriesEvent>,
  ) {}
  async createEvent(createCategoriesEventDto: CreateCategoriesEventDto): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { dateOfEvent, timeOfEvent, categoryId, leagueId, firstTeamId, secondTeamId } = createCategoriesEventDto;
      const category = await queryRunner.manager.findOne(Category, { where: { id: categoryId } });
      if (!category) throw new NotFoundException('Category not found');

      const league = await queryRunner.manager.findOne(League, { where: { id: leagueId } });
      if (!league) throw new NotFoundException('League not found');

      const isLeagueAndCategoryLinked = await queryRunner.manager.findOne(League, {
        where: { id: leagueId, category: { id: categoryId } },
      });
      if (!isLeagueAndCategoryLinked) throw new BadRequestException('League and category not linked');

      const firstTeam = await queryRunner.manager.findOne(Team, { where: { id: firstTeamId } });
      if (!firstTeam) throw new NotFoundException('First team not found');

      const secondTeam = await queryRunner.manager.findOne(Team, { where: { id: secondTeamId } });
      if (!secondTeam) throw new NotFoundException('Second team not found');

      const event = queryRunner.manager.create(CategoriesEvent, {
        dateOfEvent,
        eventTime: timeOfEvent,
        category: { id: categoryId },
        league: { id: leagueId },
      });
      const savedEvent = await queryRunner.manager.save(event);
      const eventTeam = queryRunner.manager.create(EventTeam, {
        event: { id: savedEvent.id },
        firstTeam: { id: firstTeamId },
        secondTeam: { id: secondTeamId },
      });
      await queryRunner.manager.save(eventTeam);
      await queryRunner.commitTransaction();
      return { message: 'Event created successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async getEventDetails(payload: IdDTO): Promise<CategoriesEvent> {
    try {
      const eventDetails = await this.categoriesEventRepository.findOne({
        where: { id: payload.id },
        relations: ['category', 'league', 'eventTeam.firstTeam', 'eventTeam.secondTeam'],
        select: {
          id: true,
          dateOfEvent: true,
          eventTime: true,
          category: {
            id: true,
            categoryName: true,
          },
          league: {
            id: true,
            leagueName: true,
          },
          eventTeam: {
            id: true,
            firstTeam: {
              id: true,
              teamName: true,
              logoUrl: true,
            },
            secondTeam: {
              id: true,
              teamName: true,
              logoUrl: true,
            },
          },
        },
      });
      if (!eventDetails) throw new NotFoundException('Event not found');
      return eventDetails;
    } catch (error) {
      throw error;
    }
  }
  async removeEvent(payload: IdDTO): Promise<{ message: string }> {
    try {
      const isEventExists = await this.categoriesEventRepository.findOne({ where: { id: payload.id } });
      if (!isEventExists) throw new NotFoundException('Event not found');
      await this.categoriesEventRepository.delete({ id: payload.id });
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
