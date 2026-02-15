import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes user is set via authentication middleware

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can create books');
    }

    return true;
  }
}