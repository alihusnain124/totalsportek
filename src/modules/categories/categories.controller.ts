import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, IdDTO } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { Category } from './entities/category.entity';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Category created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: CreateCategoryDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async createCategories(@Body() createCategoryDto: CreateCategoryDto): Promise<{ message: string }> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('/get-all-categories')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Categories retrieved successfully'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Categories not found'))
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/:id/category-details')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Category created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Category not found'))
  @UsePipes(FormValidationPipe)
  async getSingleCategoryDetails(@Param() payload: IdDTO): Promise<Category> {
    return await this.categoriesService.getSingleCategoryDetails(payload);
  }

  @Patch(':id/update-category')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Category updated successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Category not found'))
  @ApiBody({ type: UpdateCategoryDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async updateCategory(@Param() payload: IdDTO, @Body() updateCategoryDto: UpdateCategoryDto): Promise<{ message: string }> {
    return this.categoriesService.updateCategory(payload, updateCategoryDto);
  }

  @Delete(':id/remove-category')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Category deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Category not found'))
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async removeCategory(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.categoriesService.removeCategory(payload);
  }
}
