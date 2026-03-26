import { join } from 'path';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import envs from '@/config/envs';
import AuthConfig from '@/common/config/auth.config';
import RabbitmqConfig from '@/common/config/rabbitmq.config';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ResponseExceptionFilter } from '@/common/filters/exception.filter';

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
    ],
})
export class CommonModule {}
