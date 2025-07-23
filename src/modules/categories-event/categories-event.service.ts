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

      if (firstTeamId === secondTeamId) {
        throw new BadRequestException('Both teams must be different');
      }

      const category = await queryRunner.manager.findOne(Category, {
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');

      if (leagueId) {
        const league = await queryRunner.manager.findOne(League, {
          where: { id: leagueId, category: { id: categoryId } },
          relations: ['category'],
        });
        if (!league) throw new BadRequestException('League and category not linked');
      }

      const firstTeam = await queryRunner.manager.findOne(Team, {
        where: { id: firstTeamId },
      });
      if (!firstTeam) throw new NotFoundException('First team not found');

      const secondTeam = await queryRunner.manager.findOne(Team, {
        where: { id: secondTeamId },
      });
      if (!secondTeam) throw new NotFoundException('Second team not found');

      const existingEvent = await queryRunner.manager
        .createQueryBuilder(CategoriesEvent, 'event')
        .innerJoin('event.eventTeam', 'eventTeam')
        .where('event.dateOfEvent = :dateOfEvent', { dateOfEvent })
        .andWhere('event.eventTime = :eventTime', { eventTime: timeOfEvent })
        .andWhere(
          '(eventTeam.firstTeam = :firstTeam AND eventTeam.secondTeam = :secondTeam) OR (eventTeam.firstTeam = :secondTeam AND eventTeam.secondTeam = :firstTeam)',
          { firstTeam: firstTeamId, secondTeam: secondTeamId },
        )
        .getOne();

      if (existingEvent) {
        throw new BadRequestException('Match already scheduled between these two teams at this time');
      }

      const conflictMatch = await queryRunner.manager
        .getRepository(EventTeam)
        .createQueryBuilder('et')
        .innerJoin('et.event', 'event')
        .where('event.dateOfEvent = :date', { date: dateOfEvent })
        .andWhere('event.eventTime = :time', { time: timeOfEvent })
        .andWhere(
          '(et.firstTeam = :firstTeamId OR et.secondTeam = :firstTeamId OR et.firstTeam = :secondTeamId OR et.secondTeam = :secondTeamId)',
          { firstTeamId, secondTeamId },
        )
        .getOne();

      if (conflictMatch) {
        throw new BadRequestException('One or both teams already have a match scheduled at this time');
      }

      const event = queryRunner.manager.create(CategoriesEvent, {
        dateOfEvent,
        eventTime: timeOfEvent,
        category: { id: categoryId },
        league: { id: leagueId },
      });

      const savedEvent = await queryRunner.manager.save(CategoriesEvent, event);

      const eventTeam = queryRunner.manager.create(EventTeam, {
        event: { id: savedEvent.id },
        firstTeam: { id: firstTeamId },
        secondTeam: { id: secondTeamId },
      });

      await queryRunner.manager.save(EventTeam, eventTeam);

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
