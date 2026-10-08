import { Document, Model } from 'mongoose';
import { Department } from '../../constants/enums';
import { UserRole } from '../../constants/roles';

export interface IUser {
  name: string;
  universityId: string;
  email: string;
  password?: string;
  department: Department;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
