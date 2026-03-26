import { Request } from 'express';
import { ROLE } from '@/common/enums/app.enum';

export interface IAuthUserPayload {
    id: string;
    email?: string;
    role?: ROLE;
}

export interface IRequestWithUser extends Request {
    user: IAuthUserPayload;
}
