import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty({
    example: 'leagueName',
    description: 'name of the league',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: 'Max length of leagueName is 50' })
  @IsNotEmpty({ message: 'leagueName is required' })
  leagueName: string;

  @ApiProperty({ example: true, description: 'is top league', required: true })
  @IsNotEmpty({ message: 'isTopLeague is required' })
  @IsBoolean()
  isTopLeague: boolean;

  @ApiProperty({ type: 'string', description: 'Id of the category', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  categoryId: string;

  @ApiProperty({
    type: 'string',
    description: 'URL of the league logo',
    required: true,
    example: 'https://your-bucket-name.s3.amazonaws.com/path/to/image.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'logo is required' })
  //   @Matches(/^https:\/\/([a-z0-9\-]+)\.s3\.[a-zA-Z0-9\-]+\.amazonaws\.com\/.+$/, { message: 'Profile image must be a valid S3 URL' })
  logoUrl: string;
}
