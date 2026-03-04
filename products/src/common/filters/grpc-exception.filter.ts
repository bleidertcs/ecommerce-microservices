import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { GrpcException } from 'nestjs-grpc';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<any> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    this.logger.debug(`Catching exception: ${exception.message || exception}`);
    if (exception instanceof GrpcException) {
      return throwError(() => ({
        code: exception.getCode(),
        message: exception.message,
        details: exception.getDetails(),
      }));
    }

    // Default to Internal error for unknown exceptions
    return throwError(() => ({
      code: 13, // INTERNAL
      message: exception.message || 'Internal server error',
    }));
  }
}
