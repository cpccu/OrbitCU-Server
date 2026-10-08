import * as authService from '../../src/modules/auth/auth.service';
import { User } from '../../src/modules/auth/auth.model';
import { AppError } from '../../src/utils/AppError';

jest.mock('../../src/modules/auth/auth.model');

describe('Unit Tests: Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should throw 409 if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({ email: 'student@city.edu' });

      await expect(
        authService.registerUser({
          name: 'Student',
          universityId: '2021-1-60-001',
          email: 'student@city.edu',
          password: 'password123',
          department: 'CSE'
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw 409 if universityId already exists', async () => {
      (User.findOne as jest.Mock)
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce({ universityId: '2021-1-60-001' }); // student ID exists

      await expect(
        authService.registerUser({
          name: 'Student',
          universityId: '2021-1-60-001',
          email: 'student2@city.edu',
          password: 'password123',
          department: 'CSE'
        })
      ).rejects.toThrow(AppError);
    });

    it('should create user and return sanitized payload with JWT', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const mockCreatedUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Tanvir Ahmed',
        universityId: '2021-1-60-001',
        email: 'student@city.edu',
        department: 'CSE',
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (User.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

      const result = await authService.registerUser({
        name: 'Tanvir Ahmed',
        universityId: '2021-1-60-001',
        email: 'student@city.edu',
        password: 'password123',
        department: 'CSE'
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('student@city.edu');
      expect(result.user.name).toBe('Tanvir Ahmed');
    });
  });

  describe('loginUser', () => {
    it('should throw 401 if user not found', async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null)
      });

      await expect(
        authService.loginUser({
          email: 'notfound@city.edu',
          password: 'password123'
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw 401 if password does not match', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'student@city.edu',
        role: 'STUDENT',
        comparePassword: jest.fn().mockResolvedValueOnce(false)
      };

      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(mockUser)
      });

      await expect(
        authService.loginUser({
          email: 'student@city.edu',
          password: 'wrongpassword'
        })
      ).rejects.toThrow(AppError);
    });

    it('should return token and sanitized user on successful credentials', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Tanvir Ahmed',
        universityId: '2021-1-60-001',
        email: 'student@city.edu',
        department: 'CSE',
        role: 'STUDENT',
        comparePassword: jest.fn().mockResolvedValueOnce(true)
      };

      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(mockUser)
      });

      const result = await authService.loginUser({
        email: 'student@city.edu',
        password: 'password123'
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('student@city.edu');
    });
  });
});
