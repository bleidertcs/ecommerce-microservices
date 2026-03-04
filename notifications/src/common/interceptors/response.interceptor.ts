import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map, switchMap, from } from 'rxjs';
import { IApiResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly i18n: I18nService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<unknown>> {
        const response = context.switchToHttp().getResponse();
        const statusCode = response?.statusCode ?? 200;

        return next.handle().pipe(
            switchMap(data =>
                from(this.getResponseMessage(statusCode)).pipe(
                    map(message => {
                        return {
                            statusCode,
                            timestamp: new Date().toISOString(),
                            message,
                            data: data ?? null,
                        };
                    }),
                ),
            ),
        );
    }

    private async getResponseMessage(statusCode: number): Promise<string> {
        return this.i18n.translate(`http.success.${statusCode}`, {
            defaultValue: 'Operation successful',
        });
    }
}
