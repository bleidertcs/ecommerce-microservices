import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { DatabaseService } from '@/common/services/database.service';
import { HashService } from '@/common/services/hash.service';
import { QueryBuilderService } from '@/common/services/query-builder.service';
import { CircuitBreakerService } from '@/common/services/circuit-breaker.service';
import { JwtStrategy } from '@/common/guards/jwt.strategy';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ResponseExceptionFilter } from '@/common/filters/exception.filter';
import envs from '@/config/envs';
import AuthConfig from '@/common/config/auth.config';
import RabbitmqConfig from '@/common/config/rabbitmq.config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [envs, AuthConfig, RabbitmqConfig],

            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),

        PassportModule.register({ defaultStrategy: 'jwt' }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '../languages/'),
                watch: process.env.NODE_ENV === 'development',
            },
            resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
        }),
    ],
    providers: [
        DatabaseService,
        HashService,
        QueryBuilderService,
        CircuitBreakerService,
        JwtStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ResponseExceptionFilter,
        },
    ],
    exports: [
        ConfigModule,
        DatabaseService,
        HashService,
        QueryBuilderService,
        CircuitBreakerService,
    ],
})
export class CommonModule {}
