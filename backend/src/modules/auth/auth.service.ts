import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './auth.model';
import { RegisterUserInput, LoginUserInput, AuthSuccessPayload, SanitizedUser } from './auth.types';
import { AppError } from '../../utils/AppError';
import { jwtConfig } from '../../config/jwt';
import { MESSAGES } from '../../constants/messages';

const generateToken = (userId: string, email: string, role: string): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.expiresIn as any
  };

  return jwt.sign(
    {
      id: userId,
      email,
      role
    },
    jwtConfig.secret,
    options
  );
};

const sanitizeUser = (user: any): SanitizedUser => {
  return {
    _id: user._id.toString(),
    name: user.name,
    universityId: user.universityId,
    email: user.email,
    department: user.department,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const registerUser = async (payload: RegisterUserInput): Promise<AuthSuccessPayload> => {
  const existingEmail = await User.findOne({ email: payload.email.toLowerCase().trim() });
  if (existingEmail) {
    throw new AppError(MESSAGES.AUTH.EMAIL_EXISTS, 409);
  }

  const existingUniversityId = await User.findOne({ universityId: payload.universityId.trim() });
  if (existingUniversityId) {
    throw new AppError(MESSAGES.AUTH.STUDENT_ID_EXISTS, 409);
  }

  const user = await User.create({
    name: payload.name.trim(),
    universityId: payload.universityId.trim(),
    email: payload.email.toLowerCase().trim(),
    password: payload.password,
    department: payload.department,
    role: payload.role
  });

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: sanitizeUser(user)
  };
};

export const loginUser = async (payload: LoginUserInput): Promise<AuthSuccessPayload> => {
  const user = await User.findOne({ email: payload.email.toLowerCase().trim() }).select('+password');
  if (!user) {
    throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
  }

  const isPasswordMatch = await user.comparePassword(payload.password);
  if (!isPasswordMatch) {
    throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
  }

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: sanitizeUser(user)
  };
};

export const getMeUser = async (userId: string): Promise<SanitizedUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, 404);
  }

  return sanitizeUser(user);
};
