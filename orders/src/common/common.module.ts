import { join } from 'path';
import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import configs from '@/common/config';
import RabbitmqConfig from '@/common/config/rabbitmq.config';
import { AuthJwtAccessGuard } from '@/common/guards/jwt.access.guard';
import { JwtStrategy } from '@/common/guards/jwt.strategy';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { HashService } from '@/common/services/hash.service';
import { DatabaseService } from '@/common/services/database.service';
import { ResponseExceptionFilter } from '@/common/filters/exception.filter';
import { RequestMiddleware } from '@/common/middlewares/request.middleware';
import { QueryBuilderService } from '@/common/services/query-builder.service';
import Joi from 'joi';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { ResilienceModule } from '@/common/resilience.module';
import { CacheableMemory } from 'cacheable';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule.forRoot({
            load: [...configs, RabbitmqConfig],
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
        }),
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const ttl = configService.get<number>('redis.ttl') * 1000;
                const redisUrl = configService.get<string>('redis.url');
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({
                                ttl,
                                lruSize: 5000,
                            }),
                        }),
                        createKeyv(redisUrl),
                    ],
                };
            },
            isGlobal: true,
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '../languages/'),
                watch: process.env.NODE_ENV === 'development',
            },
            resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
        }),
        ResilienceModule,
    ],
    providers: [
        // Core Services
        DatabaseService,
        HashService,
        QueryBuilderService,
        JwtStrategy,

        // Global Interceptors
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },

        // Global Exception Filters
        {
            provide: APP_FILTER,
            useClass: ResponseExceptionFilter,
        },

        // Global Guards (order matters)
        {
            provide: APP_GUARD,
            useClass: AuthJwtAccessGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [DatabaseService, HashService, QueryBuilderService, ResilienceModule],
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
    }
}
