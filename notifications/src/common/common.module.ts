import { join } from 'path';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import configs from './config';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ResponseExceptionFilter } from './filters/exception.filter';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            load: configs,
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
    ],
    exports: [ConfigModule],
})
export class CommonModule {}
