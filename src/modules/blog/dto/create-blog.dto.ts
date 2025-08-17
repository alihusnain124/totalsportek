import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { FileExists } from 'src/decorators/file-exists.decorator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'title',
    description: 'title of the blog',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'excerpt',
    description: 'excerpt of the blog',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  excerpt: string;

  @ApiProperty({
    example: 'content',
    description: 'content of the blog',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'image',
    description: 'image of the blog',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    example: `["tag1", "tag2"]`,
    description: 'tags of the blog',
    required: false,
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({
    example: 'metaTitle',
    description: 'metaTitle of the blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({
    example: 'metaDescription',
    description: 'metaDescription of the blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({
    example: `['category1', 'category2']`,
    description: 'categories of the blog',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  categoryIds: string[];
}

export class BlogSlugDto {
  @ApiProperty({ description: 'slug', example: 'aa-ddd-ee' })
  @IsNotEmpty()
  @IsString()
  slug: string;
}

export class BlogImageDTO {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Image of the user.', required: true })
  @FileExists({ message: 'Image not provided or file format is incorrect.' })
  file: Express.Multer.File;
}
