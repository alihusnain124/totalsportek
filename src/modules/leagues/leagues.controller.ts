import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { createApiResponse } from 'src/utils/helper/generalHelper';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { League } from './entities/league.entity';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { IdDTO } from '../categories/dto/create-category.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post('create')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'League created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: CreateLeagueDto })
  @UsePipes(FormValidationPipe)
  async createLeague(@Body() CreateLeagueDto: CreateLeagueDto): Promise<{ message: string }> {
    return this.leaguesService.createLeague(CreateLeagueDto);
  }

  @Get('/get-all-leagues')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Leagues retrieved successfully'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'League not found'))
  async getAllLeagues(): Promise<League[]> {
    return await this.leaguesService.getAllLeagues();
  }

  @Patch(':id/update-league')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'League updated successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'League not found'))
  @ApiBody({ type: UpdateLeagueDto })
  @UsePipes(FormValidationPipe)
  async updateLeague(@Param() payload: IdDTO, @Body() updateLeagueDto: UpdateLeagueDto): Promise<{ message: string }> {
    return this.leaguesService.updateLeague(payload, updateLeagueDto);
  }

  @Delete(':id/remove-league')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'league deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'League not found'))
  async removeLeague(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.leaguesService.removeLeague(payload);
  }
}
