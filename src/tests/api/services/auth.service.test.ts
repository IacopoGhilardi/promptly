import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { UserService } from '../../../../services/user.service';
import { userRepository } from '../../../db/repositories/user.repository';
import { comparePasswords, hashPassword } from '../../../utils/auth';
import * as passwordUtils from '../../../utils/auth';
import { logger } from '../../../utils/logger';

// Mock dei moduli
mock.module('../../../db/repositories/user.repository', () => ({
  userRepository: {
    findByEmail: mock(async (email: string) => {
      if (email === 'existing@example.com') {
        return { 
          id: 1, 
          email: 'existing@example.com', 
          password: 'hashed_password',
          publicId: 'user123',
          name: 'Existing User'
        };
      }
      return null;
    }),
    create: mock(async (data: any) => ({ 
      id: 1, 
      email: data.email,
      password: 'hashed_password',
      publicId: 'newuser123'
    })),
    updatePassword: mock(async (userId: number, newPassword: string) => [{ 
      id: userId, 
      password: 'hashed_new_password' 
    }])
  }
}));

mock.module('../../../utils/auth', () => ({
  hashPassword: mock(() => 'hashed_password'),
  comparePasswords: mock((password, hashedPassword) => password === 'correct_password')
}));

// Mock del token generator
mock.module('../../../utils/jwt', () => ({
  generateToken: mock(() => 'mocked_jwt_token'),
  generatePasswordResetToken: mock(() => 'mocked_reset_token'),
  verifyToken: mock((token) => {
    if (token === '1') {
      return { email: 'existing@example.com' };
    }
    return null;
  })
}));

describe('UserService for auth', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    
    (userRepository.findByEmail as any).mockClear();
    (userRepository.create as any).mockClear();
    (userRepository.updatePassword as any).mockClear();
  });

  test('login should return token for valid credentials', async () => {
    const result = await service.login({ email: 'existing@example.com', password: 'correct_password' });
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith('existing@example.com');
    expect(result).toEqual({
      token: 'mocked_jwt_token',
      user: expect.objectContaining({
        name: "Existing User",
        email: "existing@example.com",
        publicId: "user123",
      })
    });
  });

  test('login should return null for invalid credentials', async () => {
    (passwordUtils.comparePasswords as any).mockImplementationOnce(() => false);
    
    expect(async () => {
      await service.login({ email: 'existing@example.com', password: 'wrong_password' });
    }).toThrow();
  });

  test('register should create a new user and return token', async () => {
    const newUser = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User'
    };
    
    const result = await service.register(newUser);
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith('new@example.com');
    expect(passwordUtils.hashPassword).toHaveBeenCalledWith('password123');
    expect(userRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      token: 'mocked_jwt_token',
      user: expect.objectContaining({
        email: 'new@example.com'
      })
    });
  });

  test('register should throw if email already exists', async () => {
    const existingUser = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User'
    };
    
    expect(async () => {
      await service.register(existingUser);
    }).toThrow();
  });

  test('resetPassword should update user password', async () => {
    // Override temporaneo del mock per questo test
    (passwordUtils.hashPassword as any).mockImplementationOnce(() => 'hashed_newpassword123');
    
    const result = await service.resetPassword('1', 'newpassword123');
    
    expect(passwordUtils.hashPassword).toHaveBeenCalledWith('newpassword123');
    expect(userRepository.updatePassword).toHaveBeenCalledWith(1, 'hashed_newpassword123');
  });
}); 