import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IAuthUserPayload } from '../interfaces/request.interface';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  use(req: Request & { user?: IAuthUserPayload }, res: Response, next: NextFunction): void {
    const userId = req.headers['x-user-id'];
    if (typeof userId === 'string' && userId) {
      req.user = { id: userId };
    }
    next();
  }
}
