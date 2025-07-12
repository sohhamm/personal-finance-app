import { sql, User } from '@/db';
import { PasswordUtils } from '@/utils/password';
import { JwtUtils } from '@/utils/jwt';
import { Logger } from '@/utils/logger';
import { AppError } from '@/middleware/error';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types/api';

export class AuthService {
  static async signup(data: SignupRequest): Promise<AuthResponse> {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUser.length > 0) {
      throw new AppError('User already exists with this email', 409);
    }

    // Validate password strength
    if (!PasswordUtils.validatePasswordStrength(password)) {
      throw new AppError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
        400
      );
    }

    // Hash password
    const passwordHash = await PasswordUtils.hashPassword(password);

    // Create user
    const [user] = await sql<User[]>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING *
    `;

    Logger.info('User created successfully', { userId: user.id, email });

    // Generate JWT token
    const token = JwtUtils.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const userResult = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;

    if (!userResult.length) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await PasswordUtils.comparePassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    Logger.info('User logged in successfully', { userId: user.id, email });

    // Generate JWT token
    const token = JwtUtils.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  static async getUserById(userId: string): Promise<Omit<User, 'password_hash'>> {
    const userResult = await sql<Omit<User, 'password_hash'>[]>`
      SELECT id, name, email, created_at, updated_at 
      FROM users 
      WHERE id = ${userId} 
      LIMIT 1
    `;

    if (!userResult.length) {
      throw new AppError('User not found', 404);
    }

    return userResult[0];
  }
}