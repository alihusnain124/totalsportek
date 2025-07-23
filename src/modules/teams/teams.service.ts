import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
      const { teamName, logoUrl, isTopTeam } = createTeamDto;
      const isTeamExists = await this.teamRepository.findOne({ where: { teamName } });
      if (isTeamExists) throw new ConflictException('Team already exists');
      const category = this.teamRepository.create({ teamName, logoUrl, isTopTeam });
      await this.teamRepository.save(category);
      return { message: 'Team created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      return await this.teamRepository.find({
        select: {
          id: true,
          teamName: true,
          logoUrl: true,
          isTopTeam: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getTopTeams(): Promise<Team[]> {
    try {
      return await this.teamRepository.find({
        where: { isTopTeam: true },
        select: { id: true, teamName: true, logoUrl: true, isTopTeam: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async getTeamSpecificEvents(payload: IdDTO): Promise<any> {
    try {
      const teamEvents = await this.teamRepository.findOne({
        where: { id: payload.id },
        relations: [
          'firstTeam.event.category',
          'secondTeam.event.category',
          'firstTeam.event.eventTeam.firstTeam',
          'firstTeam.event.eventTeam.secondTeam',
          'secondTeam.event.eventTeam.firstTeam',
          'secondTeam.event.eventTeam.secondTeam',
        ],
      });
      return this.formatTeamSpecificEvents(teamEvents);
    } catch (error) {
      throw error;
    }
  }

  private formatTeamSpecificEvents(team: Team) {
    const eventsAsFirstTeam = team.firstTeam.map((item) => ({
      eventId: item.event.id,
      dateOfEvent: item.event.dateOfEvent,
      eventTime: item.event.eventTime,
      category: item.event.category.categoryName,
      opponentTeam: {
        id: item.event.eventTeam.secondTeam.id,
        teamName: item.event.eventTeam.secondTeam.teamName,
        logoUrl: item.event.eventTeam.secondTeam.logoUrl,
      },
    }));

    const eventsAsSecondTeam = team.secondTeam.map((item) => ({
      eventId: item.event.id,
      dateOfEvent: item.event.dateOfEvent,
      eventTime: item.event.eventTime,
      category: item.event.category.categoryName,
      opponentTeam: {
        id: item.event.eventTeam.firstTeam.id,
        teamName: item.event.eventTeam.firstTeam.teamName,
        logoUrl: item.event.eventTeam.firstTeam.logoUrl,
      },
    }));

    return {
      id: team.id,
      teamName: team.teamName,
      logoUrl: team.logoUrl,
      isTopTeam: team.isTopTeam,
      events: [...eventsAsFirstTeam, ...eventsAsSecondTeam],
    };
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
      const teamDetails = await this.getSingleTeamDetails(payload);
      const { teamName, logoUrl, isTopTeam } = updateTeamDto;
      const isTeamExists = await this.teamRepository.findOne({ where: { teamName } });
      if (isTeamExists) throw new ConflictException('Team already exists');
      teamDetails.teamName = teamName;
      teamDetails.logoUrl = logoUrl;
      teamDetails.isTopTeam = isTopTeam;
      await this.teamRepository.save(teamDetails);
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
