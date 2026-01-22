import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CommonModule } from 'src/common/common.module';
import { AuthPublicController } from './controllers/auth.public.controller';
import { EventsController } from './controllers/events.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        JwtModule.register({}),
        PassportModule.register({ session: false }),
        CommonModule,
        UserModule,
    ],
    controllers: [AuthPublicController, EventsController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
