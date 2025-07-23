import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    example: 'teamName',
    description: 'name of the team',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: 'Max length of teamName is 50' })
  @IsNotEmpty({ message: 'teamName is required' })
  teamName: string;

  @ApiProperty({ example: true, description: 'is top team', required: true })
  @IsNotEmpty({ message: 'isTopTeam is required' })
  @IsBoolean()
  isTopTeam: boolean;

  @ApiProperty({
    type: 'string',
    description: 'URL of the team logo',
    required: true,
    example: 'https://your-bucket-name.s3.amazonaws.com/path/to/image.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'logo is required' })
  //   @Matches(/^https:\/\/([a-z0-9\-]+)\.s3\.[a-zA-Z0-9\-]+\.amazonaws\.com\/.+$/, { message: 'Profile image must be a valid S3 URL' })
  logoUrl: string;
}
