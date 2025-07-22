import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createApiResponse } from 'src/utils/helper/generalHelper';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';

import { IdDTO } from '../categories/dto/create-category.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Team created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: CreateTeamDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<{ message: string }> {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Get('/get-all-teams')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Teams retrieved successfully'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Team not found'))
  async getAllTeams(): Promise<Team[]> {
    return await this.teamsService.getAllTeams();
  }

  @Patch(':id/update-team')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Team updated successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Team not found'))
  @ApiBody({ type: UpdateTeamDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async updateTeam(@Param() payload: IdDTO, @Body() updateTeamDto: UpdateTeamDto): Promise<{ message: string }> {
    return this.teamsService.updateTeam(payload, updateTeamDto);
  }

  @Delete(':id/remove-team')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Team deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Team not found'))
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async removeTeam(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.teamsService.removeTeam(payload);
  }
}
