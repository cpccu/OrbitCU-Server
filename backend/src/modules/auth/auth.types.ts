import { Department } from '../../constants/enums';
import { UserRole } from '../../constants/roles';

export interface RegisterUserInput {
  name: string;
  universityId: string;
  email: string;
  password: string;
  department: Department;
  role?: UserRole;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface SanitizedUser {
  _id: string;
  name: string;
  universityId: string;
  email: string;
  department: Department;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthSuccessPayload {
  token: string;
  user: SanitizedUser;
}
