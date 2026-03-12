import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<any> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    this.logger.debug(`Catching exception: ${exception.message || exception}`);
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    // For standard Error/not-found cases
    return throwError(() => ({
      code: 5, // NOT_FOUND
      message: exception.message || 'Internal server error',
    }));
  }
}
