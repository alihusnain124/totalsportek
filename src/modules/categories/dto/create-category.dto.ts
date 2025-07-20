import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'categoryName',
    description: 'The categoryName of the vendor.',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: 'Max length of categoryName is 50' })
  @IsNotEmpty({ message: 'categoryName is required' })
  categoryName: string;
}

export class IdDTO {
  @ApiProperty({ description: 'id', example: 'd6b79c1c-57d5-4b89-88f9-72f62aabafce' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
