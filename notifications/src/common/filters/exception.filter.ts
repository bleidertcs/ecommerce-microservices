import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { IErrorResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class ResponseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ResponseExceptionFilter.name);

    constructor(private readonly configService: ConfigService) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const contextType = host.getType();

        if (contextType === 'http') {
            this.handleHttpException(exception, host);
        }
    }

    private handleHttpException(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const statusCode = exception.getStatus();
        let message = 'Internal server error';

        if (exception instanceof BadRequestException) {
            const exceptionResponse = exception.getResponse() as any;
            message = Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message.join(', ')
                : exceptionResponse.message || message;
        } else {
            message = exception.message;
        }

        const errorResponse: IErrorResponse = {
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url} - ${statusCode}`, exception);
        }

        response.status(statusCode).json(errorResponse);
    }
}
