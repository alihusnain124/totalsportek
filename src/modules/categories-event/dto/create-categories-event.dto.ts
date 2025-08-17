import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateCategoriesEventDto {
  @ApiProperty({ description: 'category_id', example: 'd6b79c1c-57d5-4b89-88f9-72f62aabafce' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'league_id', example: 'd6b79c1c-57d5-4b89-88f9-72f62aabafce', required: false })
  @IsOptional()
  @IsUUID()
  leagueId?: string;

  @ApiProperty({ description: 'first_team_id', example: 'd6b79c1c-57d5-4b89-88f9-72f62aabafce' })
  @IsNotEmpty()
  @IsUUID()
  firstTeamId: string;

  @ApiProperty({ description: 'second_team_id', example: 'd6b79c1c-57d5-4b89-88f9-72f62aabafce' })
  @IsNotEmpty()
  @IsUUID()
  secondTeamId: string;

  @ApiProperty({ description: 'dateOfEvent', example: '2026-01-01', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfEvent: Date;

  @ApiProperty({ example: '14:30:00', description: 'Time of the event (HH:mm:ss)' })
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'timeOfEvent must be in HH:mm:ss format' })
  timeOfEvent: string;

  @ApiProperty({ description: 'stream_url', example: 'https://example.com/event.mp4', required: false })
  @IsOptional()
  streamUrl?: string;
}
