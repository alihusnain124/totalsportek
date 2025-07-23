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

  async getSingleCategoryDetails(payload: IdDTO): Promise<any> {
    try {
      const category = await this.categoryRepository.find({
        where: { id: payload.id },
        relations: [
          'categoryEvents',
          'categoryEvents.league',
          'categoryEvents.eventTeam',
          'categoryEvents.eventTeam.firstTeam',
          'categoryEvents.eventTeam.secondTeam',
        ],
      });
      if (!category) throw new NotFoundException('Category not found');
      return this.formatCategoryDetails(category);
    } catch (error) {
      throw error;
    }
  }

  private formatCategoryDetails(categoryDetails: Category[]): any {
    return categoryDetails.map((category) => {
      const leagueMap = new Map<string, any>();
      const noLeagueEvents: any[] = [];

      category.categoryEvents.forEach((event) => {
        const league = event.league;

        if (league) {
          if (!leagueMap.has(league.id)) {
            leagueMap.set(league.id, {
              leagueId: league.id,
              leagueName: league.leagueName,
              logoUrl: league.logoUrl,
              events: [],
            });
          }

          leagueMap.get(league.id).events.push({
            id: event.id,
            dateOfEvent: event.dateOfEvent,
            eventTime: event.eventTime,
            teams: {
              firstTeam: {
                id: event.eventTeam.firstTeam.id,
                teamName: event.eventTeam.firstTeam.teamName,
                logoUrl: event.eventTeam.firstTeam.logoUrl,
              },
              secondTeam: {
                id: event.eventTeam.secondTeam.id,
                teamName: event.eventTeam.secondTeam.teamName,
                logoUrl: event.eventTeam.secondTeam.logoUrl,
              },
            },
          });
        } else {
          noLeagueEvents.push({
            id: event.id,
            dateOfEvent: event.dateOfEvent,
            eventTime: event.eventTime,
            teams: {
              firstTeam: {
                id: event.eventTeam.firstTeam.id,
                teamName: event.eventTeam.firstTeam.teamName,
                logoUrl: event.eventTeam.firstTeam.logoUrl,
              },
              secondTeam: {
                id: event.eventTeam.secondTeam.id,
                teamName: event.eventTeam.secondTeam.teamName,
                logoUrl: event.eventTeam.secondTeam.logoUrl,
              },
            },
          });
        }
      });

      const groupedEvents = [...leagueMap.values()];

      if (noLeagueEvents.length > 0) {
        groupedEvents.push({
          noLeague: true,
          events: noLeagueEvents,
        });
      }

      return {
        id: category.id,
        categoryName: category.categoryName,
        groupedEvents,
      };
    });
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
