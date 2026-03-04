export interface IAuthUserPayload {
  id: string;
}

export interface IRequestWithUser extends Request {
  user: IAuthUserPayload;
}
