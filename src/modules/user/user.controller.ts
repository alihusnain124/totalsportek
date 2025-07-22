import { Controller, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createApiResponse } from 'src/utils/helper/generalHelper';
import { FormValidationPipe } from 'src/pipes/form-validation.pipe';
import { IdDTO } from '../categories/dto/create-category.dto';
import { CheckAdminLoginGuard } from '../auth/guards/check-admin-login.guard';
import RequestWithUser from '../auth/types/request-with-email.type';
@ApiBearerAuth()
@Controller('admin-user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Admin User created successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED, 'Admin User is invalid'))
  @ApiBody({ type: CreateUserDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async createAdminUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.userService.createAdminUser(createUserDto);
  }

  @Patch('/update-password')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, `Admin User's password  updated successfully`))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Admin User not found'))
  @ApiBody({ type: UpdateUserPasswordDto })
  @UsePipes(FormValidationPipe)
  @UseGuards(CheckAdminLoginGuard)
  async updateUserDetails(
    @Req() requestWithUser: RequestWithUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<{ message: string }> {
    const { id } = requestWithUser.user;
    return this.userService.updateUserPassword(id, updateUserPasswordDto);
  }

  @Delete(':id/remove-user')
  @ApiOkResponse(createApiResponse(HttpStatus.OK, 'Admin User deleted successfully'))
  @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST, 'invalid data provided'))
  @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND, 'Admin User not found'))
  @UseGuards(CheckAdminLoginGuard)
  @UsePipes(FormValidationPipe)
  async removeTeam(@Param() payload: IdDTO): Promise<{ message: string }> {
    return this.userService.removeUser(payload);
  }
}
