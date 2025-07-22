import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'password', description: 'password', required: true })
  @IsNotEmpty({ message: 'password is required' })
  @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 0, minUppercase: 1 })
  @IsString()
  password: string;

  @ApiProperty({ example: 'confirmPassword', description: 'confirmPassword', required: true })
  @IsNotEmpty({ message: 'confirmPassword is required' })
  @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 0, minUppercase: 1 })
  @IsString()
  confirmPassword: string;
}
