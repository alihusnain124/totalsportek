import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Req,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogImageDTO, BlogSlugDto, CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ImageUploadInterceptor } from './interceptors/image-upload.interceptor';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createApiResponse, PaginatedResponse } from 'src/utils/helper/generalHelper';
import RequestWithUser from '../auth/types/request-with-email.type';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';
import { Blog } from './entities/blog.entity';
import { GetAllBlogsDto } from './dto/get-all-blogs.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/upload-image')
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'data is invalid'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Record not found'))
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'User updated successfully'))
  @ApiBody({ type: BlogImageDTO })
  @UseInterceptors(ImageUploadInterceptor)
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<Record<string, string>> {
    const imagePath = file ? `${process.env.SERVER_URL}/public/images/${file.filename}` : null;
    return { image: imagePath };
  }

  @Post('/create-blog')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Blog created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: CreateBlogDto })
  @UseGuards(CheckAdminLoginGuard)
  @UsePipes(FormValidationPipe)
  async createBlog(@Body() createBlogDto: CreateBlogDto, @Req() requestWithUser: RequestWithUser): Promise<{ message: string }> {
    const { id: userId } = requestWithUser.user;
    return this.blogService.create(createBlogDto, userId);
  }

  @Get('get-all-blogs')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Blogs fetched successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @UsePipes(FormValidationPipe)
  async findAllBlogs(@Query() filters: GetAllBlogsDto): Promise<PaginatedResponse<Blog>> {
    return this.blogService.getAllBlogs(filters);
  }

  @Get('/:slug/get-single-blog-details')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Blog fetched successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @UsePipes(FormValidationPipe)
  async findOne(@Param() payload: BlogSlugDto): Promise<Blog> {
    return this.blogService.getSingleBlogDetails(payload);
  }

  @Patch('/:slug/update-blog')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Blogs updated successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiBody({ type: UpdateBlogDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async updateBlog(@Param() payload: BlogSlugDto, @Body() updateBlogDto: UpdateBlogDto): Promise<{ message: string }> {
    return this.blogService.updateBlog(payload, updateBlogDto);
  }

  @Delete('/:slug/remove-blog')
  @ApiBearerAuth()
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Blogs deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async remove(@Param() payload: BlogSlugDto): Promise<{ message: string }> {
    return this.blogService.remove(payload);
  }
}
