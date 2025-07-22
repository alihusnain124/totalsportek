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
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { League } from './entities/league.entity';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { IdDTO } from '../categories/dto/create-category.dto';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'League created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: CreateLeagueDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
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
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'League updated successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'League not found'))
  @ApiBody({ type: UpdateLeagueDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async updateLeague(@Param() payload: IdDTO, @Body() updateLeagueDto: UpdateLeagueDto): Promise<{ message: string }> {
    return this.leaguesService.updateLeague(payload, updateLeagueDto);
  }

  @Delete(':id/remove-league')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'league deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'League not found'))
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async removeLeague(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.leaguesService.removeLeague(payload);
  }
}
