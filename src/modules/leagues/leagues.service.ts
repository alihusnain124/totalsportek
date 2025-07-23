import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { IdDTO } from '../categories/dto/create-category.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League) private readonly leagueRepository: Repository<League>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}
  async createLeague(createLeagueDto: CreateLeagueDto): Promise<{ message: string }> {
    try {
      const isLeagueExist = await this.leagueRepository.findOne({ where: { leagueName: createLeagueDto.leagueName } });
      if (isLeagueExist) throw new ConflictException('League already exist');
      const { leagueName, logoUrl, isTopLeague, categoryId } = createLeagueDto;
      const isCategoryExists = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!isCategoryExists) throw new NotFoundException('Category not found');
      const category = this.leagueRepository.create({ leagueName, logoUrl, isTopLeague, category: { id: categoryId } });
      await this.leagueRepository.save(category);
      return { message: 'League created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllLeagues(): Promise<League[]> {
    try {
      return await this.leagueRepository.find({
        relations: ['category'],
        select: {
          id: true,
          leagueName: true,
          logoUrl: true,
          isTopLeague: true,
          category: {
            id: true,
            categoryName: true,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getLeagueSpecificEvents(payload: IdDTO): Promise<League> {
    try {
      return await this.leagueRepository.findOne({
        where: { id: payload.id },
        relations: ['categoryEvents.eventTeam.firstTeam', 'categoryEvents.eventTeam.secondTeam'],
        select: {
          id: true,
          leagueName: true,
          logoUrl: true,
          categoryEvents: {
            id: true,
            dateOfEvent: true,
            eventTime: true,
            eventTeam: {
              id: true,
              firstTeam: { id: true, teamName: true, logoUrl: true },
              secondTeam: { id: true, teamName: true, logoUrl: true },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getTopLeagues(): Promise<League[]> {
    try {
      return await this.leagueRepository.find({
        where: { isTopLeague: true },
        relations: ['category'],
        select: {
          id: true,
          leagueName: true,
          logoUrl: true,
          isTopLeague: true,
          category: {
            id: true,
            categoryName: true,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getSingleLeagueDetails(payload: IdDTO): Promise<League> {
    try {
      const league = await this.leagueRepository.findOne({ where: { id: payload.id } });
      if (!league) {
        throw new NotFoundException('League not found');
      }
      return league;
    } catch (error) {
      throw error;
    }
  }

  async updateLeague(payload: IdDTO, updateLeagueDto: UpdateLeagueDto): Promise<{ message: string }> {
    try {
      const leagueDetails = await this.getSingleLeagueDetails(payload);
      const { leagueName, logoUrl } = updateLeagueDto;
      const isLeagueExists = await this.leagueRepository.findOne({ where: { leagueName } });
      if (isLeagueExists) throw new ConflictException('League already exists');
      leagueDetails.leagueName = leagueName;
      leagueDetails.logoUrl = logoUrl;
      leagueDetails.isTopLeague = updateLeagueDto.isTopLeague;
      await this.leagueRepository.save(leagueDetails);
      return { message: 'League updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async removeLeague(payload: IdDTO): Promise<{ message: string }> {
    try {
      await this.getSingleLeagueDetails(payload);
      await this.leagueRepository.delete(payload.id);
      return { message: 'League deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
