import { Controller, Get, Post, Body, Param, HttpStatus, UsePipes, UseGuards, Delete } from '@nestjs/common';
import { CategoriesEventService } from './categories-event.service';
import { CreateCategoriesEventDto } from './dto/create-categories-event.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { createApiResponse } from 'src/utils/helper/generalHelper';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';
import { CategoriesEvent } from './entities/categories-event.entity';
import { IdDTO } from '../categories/dto/create-category.dto';

@Controller('category-event')
export class CategoriesEventController {
  constructor(private readonly categoriesEventService: CategoriesEventService) {}

  @Post('/create')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Event created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Category/League/Team not found'))
  @ApiBody({ type: CreateCategoriesEventDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async createEvent(@Body() createCategoriesEventDto: CreateCategoriesEventDto): Promise<{ message: string }> {
    return this.categoriesEventService.createEvent(createCategoriesEventDto);
  }

  @Get('/:id/event-details')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Event details fetched successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Event not found'))
  @UsePipes(FormValidationPipe)
  async getEventDetails(@Param() payload: IdDTO): Promise<CategoriesEvent> {
    return this.categoriesEventService.getEventDetails(payload);
  }

  @Delete(':id/remove-event')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Event deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Event not found'))
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async removeCategory(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.categoriesEventService.removeEvent(payload);
  }
}
