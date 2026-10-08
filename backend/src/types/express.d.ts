import { Types } from 'mongoose';
import { UserRole } from '../constants/roles';
import { Department } from '../constants/enums';

export interface IAuthUser {
  _id: Types.ObjectId | string;
  name: string;
  universityId: string;
  email: string;
  department: Department;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export {};
