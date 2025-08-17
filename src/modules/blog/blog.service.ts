import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogSlugDto, CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Category } from '../categories/entities/category.entity';
import { GetAllBlogsDto } from './dto/get-all-blogs.dto';
import { buildPaginatedResponse, PaginatedResponse } from 'src/utils/helper/generalHelper';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}
  async create(createBlogDto: CreateBlogDto, userId: string): Promise<{ message: string }> {
    try {
      const isBlogExists = await this.blogRepository.findOne({ where: { title: createBlogDto.title } });
      if (isBlogExists) throw new BadRequestException('Blog with this title already exists');
      const { categoryIds, ...rest } = createBlogDto;
      console.log('categoryIds', categoryIds);
      if (categoryIds && categoryIds.length > 0) {
        await Promise.all(
          categoryIds.map(async (categoryId) => {
            const category = await this.categoryRepository.findOneBy({ id: categoryId });
            if (!category) {
              throw new NotFoundException(`Category with id ${categoryId} not found`);
            }
          }),
        );
      }
      const slug = slugify(createBlogDto.title.toLowerCase());
      const blog = this.blogRepository.create({
        ...rest,
        slug,
        arthur: { id: userId },
        categories: categoryIds ? categoryIds.map((id) => ({ id })) : [],
      });

      await this.blogRepository.save(blog);
      return { message: 'Blog created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getAllBlogs(filters: GetAllBlogsDto): Promise<PaginatedResponse<Blog>> {
    try {
      const { page, limit } = filters;
      const skip = (page - 1) * limit;
      const [blogs, total] = await this.blogRepository.findAndCount({
        skip,
        take: limit,
        relations: ['arthur', 'categories'],
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          arthur: { id: true, name: true },
          categories: { id: true, categoryName: true },
          createdAt: true,
        },
        order: { createdAt: 'DESC' },
      });
      return buildPaginatedResponse(blogs, { page, limit, total });
    } catch (error) {
      throw error;
    }
  }

  async getSingleBlogDetails(payload: BlogSlugDto): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { slug: payload.slug },
        relations: ['arthur', 'categories'],
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          image: true,
          tags: true,
          arthur: { id: true, name: true },
          categories: { id: true, categoryName: true },
          createdAt: true,
        },
      });
      if (!blog) throw new NotFoundException('Blog not found');
      return blog;
    } catch (error) {
      throw error;
    }
  }

  async updateBlog(payload: BlogSlugDto, updateBlogDto: UpdateBlogDto): Promise<{ message: string }> {
    try {
      const isBlogExists = await this.blogRepository.findOne({
        where: { title: updateBlogDto.title },
      });

      if (isBlogExists && isBlogExists.slug !== payload.slug) {
        throw new BadRequestException('Blog with this title already exists');
      }

      const blog = await this.blogRepository.findOne({
        where: { slug: payload.slug },
        relations: ['arthur', 'categories'],
      });

      if (!blog) throw new NotFoundException('Blog not found');

      let newCategories = [];

      if (updateBlogDto.categoryIds && updateBlogDto.categoryIds.length > 0) {
        newCategories = await Promise.all(
          updateBlogDto.categoryIds.map(async (categoryId) => {
            const category = await this.categoryRepository.findOneBy({ id: categoryId });
            if (!category) {
              throw new NotFoundException(`Category with id ${categoryId} not found`);
            }
            return category;
          }),
        );
      }

      blog.categories = newCategories;

      const slug = slugify(updateBlogDto.title.toLowerCase());
      Object.assign(blog, updateBlogDto, { slug });

      if (updateBlogDto.image) {
        blog.image = updateBlogDto.image;
      }

      await this.blogRepository.save(blog);
      return { message: 'Blog updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(payload: BlogSlugDto): Promise<{ message: string }> {
    try {
      const blog = await this.blogRepository.findOne({ where: { slug: payload.slug } });
      if (!blog) throw new NotFoundException('Blog not found');
      await this.blogRepository.delete(blog.id);
      return { message: 'Blog deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
