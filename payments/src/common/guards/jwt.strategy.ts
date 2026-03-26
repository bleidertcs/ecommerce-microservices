import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        const publicKey = configService.get<string>('auth.publicKey');
        const issuer = configService.get<string>('auth.issuer');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicKey!,
            algorithms: ['RS256'],
            issuer: issuer,
        });
    }

    async validate(payload: any) {
        if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid token payload');
        }

        return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            role: payload.role || 'USER',
        };
    }
}
