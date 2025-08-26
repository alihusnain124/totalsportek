import { Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async adminLogin(adminLoginDto: AdminLoginDto): Promise<{ token: string }> {
    try {
      return await this.userService.loginAdminUser(adminLoginDto.email, adminLoginDto.password);
    } catch (error) {
      throw error;
    }
  }
  async verifyToken(token: string): Promise<{ id: string; email: string }> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }
}
