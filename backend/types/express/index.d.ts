export interface IGetUserAuthInfoRequest extends Request {
    user?: {
        id: string;
        username?: string;
    }
  }