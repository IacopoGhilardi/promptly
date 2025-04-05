import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePasswords } from '../../utils/auth';
import { logger } from '../../utils/logger';
import { userRepository } from '../../db/repositories/user.repository';
import { generateToken, generatePasswordResetToken, verifyToken } from '../../utils/jwt';
import { sendTemplatedEmail } from '../../emails/index';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface RegisterUserDto extends CreateUserDto {
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    name: string;
    email: string;
    publicId: string;
  };
  token: string;
}

export class UserService {
  async createUser(data: CreateUserDto) {
    logger.info({ data: { ...data, password: '***' } }, 'Creating new user');
    const hashedPassword = await hashPassword(data.password);
    
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
      publicId: uuidv4(),
    });

    logger.info({ userId: user.publicId }, 'User created successfully');
    return user;
  }

  async getUsers() {
    logger.info('Fetching all users');
    const result = await userRepository.findAll();
    logger.info({ count: result.length }, 'Users fetched successfully');
    return result;
  }

  async getUserById(publicId: string) {
    logger.info({ userId: publicId }, 'Fetching user by ID');
    const result = await userRepository.findByPublicId(publicId);
    
    if (!result) {
      logger.warn({ userId: publicId }, 'User not found');
    } else {
      logger.info({ userId: publicId }, 'User fetched successfully');
    }
    
    return result;
  }

  async updateUser(publicId: string, data: UpdateUserDto) {
    logger.info({ userId: publicId, data: { ...data, password: data.password ? '***' : undefined } }, 'Updating user');
    
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const result = await userRepository.update(Number(publicId), data);

    if (!result) {
      logger.warn({ userId: publicId }, 'User not found for update');
    } else {
      logger.info({ userId: publicId }, 'User updated successfully');
    }

    return result;
  }

  async deleteUser(publicId: string) {
    logger.info({ userId: publicId }, 'Deleting user');
    const result = await userRepository.softDelete(Number(publicId));

    if (!result) {
      logger.warn({ userId: publicId }, 'User not found for deletion');
    } else {
      logger.info({ userId: publicId }, 'User deleted successfully');
    }

    return result;
  }

  async register(data: RegisterUserDto): Promise<AuthResponse> {
    logger.info({ data: { ...data, password: '***' } }, 'Registering new user');
    
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      logger.warn({ email: data.email }, 'User already exists');
      throw new Error('User with this email already exists');
    }
    
    const user = await this.createUser(data);
    
    const token = generateToken({
      userId: user.publicId, 
      email: user.email 
    });

    return {
      user: {
        name: user.name,
        email: user.email,
        publicId: user.publicId,
      },
      token
    };
  }

  async login(data: LoginUserDto): Promise<AuthResponse> {
    logger.info({ email: data.email }, 'User login attempt');
    
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      logger.warn({ email: data.email }, 'Login failed: user not found');
      throw new Error('Invalid email or password');
    }
    
    const passwordMatch = await comparePasswords(data.password, user.password);
    if (!passwordMatch) {
      logger.warn({ email: data.email }, 'Login failed: incorrect password');
      throw new Error('Invalid email or password');
    }
    
    logger.info({ userId: user.publicId }, 'User login successful');
    
    const token = generateToken({ 
      userId: user.publicId, 
      email: user.email 
    });
    
    return {
      user: {
        name: user.name,
        email: user.email,
        publicId: user.publicId,
      },
      token
    };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;
    
    const resetToken = generatePasswordResetToken(email);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendTemplatedEmail(
      email, 
      'Reset Password Remindr', 
      'reset_password', 
      { resetUrl }
    );
    
    logger.info({ email }, 'Password reset email sent');
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = verifyToken(token) as { email: string };
      if (!payload || !payload.email) throw new Error('Invalid token');
      
      const user = await userRepository.findByEmail(payload.email);
      if (!user) throw new Error('User not found');
      
      const hashedPassword = await hashPassword(newPassword);
      await userRepository.updatePassword(user.id, hashedPassword);
      
      logger.info({ email: payload.email }, 'Password reset successful');
    } catch (error) {
      logger.error(error, 'Password reset failed');
      throw new Error('Invalid or expired token');
    }
  }
}

export const userService = new UserService();
