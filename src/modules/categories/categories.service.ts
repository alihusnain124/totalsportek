import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, IdDTO } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<{ message: string }> {
    try {
      const existingCategory = await this.categoryRepository.findOne({ where: { categoryName: createCategoryDto.categoryName } });
      if (existingCategory) throw new ConflictException('Category already exists');
      const { categoryName } = createCategoryDto;
      const category = this.categoryRepository.create({ categoryName });
      await this.categoryRepository.save(category);
      return { message: 'Category created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getSingleCategoryDetails(payload: IdDTO): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id: payload.id } });
      if (!category) throw new NotFoundException('Category not found');
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(payload: IdDTO, updateCategoryDto: UpdateCategoryDto): Promise<{ message: string }> {
    try {
      const categoryDetails = await this.getSingleCategoryDetails(payload);
      const { categoryName } = updateCategoryDto;
      const isCategoryExists = await this.categoryRepository.findOne({ where: { categoryName } });
      if (isCategoryExists) throw new ConflictException('Category already exists');
      categoryDetails.categoryName = categoryName;
      await this.categoryRepository.save(categoryDetails);
      return { message: 'Category updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async removeCategory(payload: IdDTO): Promise<{ message: string }> {
    try {
      await this.getSingleCategoryDetails(payload);
      await this.categoryRepository.delete(payload.id);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
