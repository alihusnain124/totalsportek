import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    example: 'email',
    description: 'email of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ example: 'password', description: 'password', required: true })
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  password: string;
}
