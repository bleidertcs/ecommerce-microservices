import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id?: string;
  sub?: string;
  email?: string;
}

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string;
    return { id: userId, sub: userId };
  },
);
