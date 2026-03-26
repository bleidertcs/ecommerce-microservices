import { ROLE } from '@/common/enums/app.enum';

export interface IAuthUserPayload {
    id: string;
    role: ROLE;
}

export interface IRequestWithUser extends Request {
    user: IAuthUserPayload;
    requestId?: string;
    correlationId?: string;
}
