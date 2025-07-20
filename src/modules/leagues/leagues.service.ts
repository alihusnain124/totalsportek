import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { IdDTO } from '../categories/dto/create-category.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  constructor(@InjectRepository(League) private readonly leagueRepository: Repository<League>) {}
  async createLeague(createLeagueDto: CreateLeagueDto): Promise<{ message: string }> {
    try {
      const { leagueName, logoUrl } = createLeagueDto;
      const category = this.leagueRepository.create({ leagueName, logoUrl });
      await this.leagueRepository.save(category);
      return { message: 'League created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllLeagues(): Promise<League[]> {
    try {
      return await this.leagueRepository.find();
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
      await this.getSingleLeagueDetails(payload);
      const { leagueName, logoUrl } = updateLeagueDto;
      await this.leagueRepository.update(payload.id, { leagueName, logoUrl });
      return { message: 'League updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async removeLeague(payload: IdDTO): Promise<{ message: string }> {
    try {
      await this.getSingleLeagueDetails(payload);
      await this.leagueRepository.delete(payload.id);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
