import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from '../constants/request.constant';

@Injectable()
export class AuthJwtAccessGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.headers['x-user-id'];
        const userRole = request.headers['x-user-role'];

        if (!userId) {
            throw new UnauthorizedException('User ID not found in headers. Did you go through Kong?');
        }

        request.user = {
            id: userId,
            role: userRole || 'USER',
        };

        return true;
    }
}
