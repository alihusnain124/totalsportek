import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IdDTO } from '../categories/dto/create-category.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  async createAdminUser(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (userExists) throw new BadRequestException('Admin user already exists');
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return { message: 'Admin user created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getSingleUserDetails(payload: IdDTO): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) throw new NotFoundException('Admin user not found');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(userId: string, updateUserPasswordDto: UpdateUserPasswordDto): Promise<{ message: string }> {
    try {
      const { password, confirmPassword } = updateUserPasswordDto;
      if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');
      const user = await this.getSingleUserDetails({ id: userId });
      user.password = password;
      await this.userRepository.save(user);
      return { message: 'Admin user password updated successfully' };
    } catch (error) {
      throw error;
    }
  }
  async removeUser(payload: IdDTO): Promise<{ message: string }> {
    try {
      await this.getSingleUserDetails(payload);
      await this.userRepository.delete(payload.id);
      return { message: 'Admin user deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async loginAdminUser(email: string, password: string): Promise<{ message: string; token: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('Admin user not found');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new BadRequestException('Password is incorrect');
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return { token, message: 'Admin user logged in successfully' };
    } catch (error) {
      throw error;
    }
  }
}
