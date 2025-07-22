import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'name',
    description: 'name of the user',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: 'Max length of name is 50' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

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
  @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 0, minUppercase: 1 })
  @IsString()
  password: string;
}
