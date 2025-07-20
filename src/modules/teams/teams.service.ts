import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdDTO } from '../categories/dto/create-category.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private readonly teamRepository: Repository<Team>) {}
  async createTeam(createTeamDto: CreateTeamDto): Promise<{ message: string }> {
    try {
      const { teamName, logoUrl } = createTeamDto;
      const category = this.teamRepository.create({ teamName, logoUrl });
      await this.teamRepository.save(category);
      return { message: 'Team created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      return await this.teamRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getSingleTeamDetails(payload: IdDTO): Promise<Team> {
    try {
      const league = await this.teamRepository.findOne({ where: { id: payload.id } });
      if (!league) {
        throw new NotFoundException('Team not found');
      }
      return league;
    } catch (error) {
      throw error;
    }
  }

  async updateTeam(payload: IdDTO, updateTeamDto: UpdateTeamDto): Promise<{ message: string }> {
    try {
      await this.getSingleTeamDetails(payload);
      const { teamName, logoUrl } = updateTeamDto;
      await this.teamRepository.update(payload.id, { teamName, logoUrl });
      return { message: 'Team updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async removeTeam(payload: IdDTO): Promise<{ message: string }> {
    try {
      await this.getSingleTeamDetails(payload);
      await this.teamRepository.delete(payload.id);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
