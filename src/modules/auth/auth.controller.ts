import { Controller, Post, Body, HttpStatus, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { createApiResponse } from 'src/utils/helper/generalHelper';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin-login')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'User logged in successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'User is invalid'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'User not found'))
  @ApiBody({ type: AdminLoginDto })
  @UsePipes(FormValidationPipe)
  async adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<{ token: string; message: string }> {
    return this.authService.adminLogin(adminLoginDto);
  }
}
