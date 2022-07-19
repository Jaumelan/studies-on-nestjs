import { User } from './user.entity';

export declare global {
  namespace Express {
    export interface Request {
      currentUser?: User;
      session?: {
        userId?: number;
      };
    }
  }
}
