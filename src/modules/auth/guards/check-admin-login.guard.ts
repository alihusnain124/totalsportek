import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CheckAdminLoginGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Unauthorized access');
      const token = authHeader.split(' ')[1];
      const payload = await this.VerifyToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw error;
    }
  }

  private VerifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }
}
