import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiProperty({ required: false, default: 10, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}

export class GetAllBlogsDto extends PaginationDTO {}
