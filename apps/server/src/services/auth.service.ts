import type { User } from '@/db';
import { sql } from '@/db';
import { AppError, ConflictError, UnauthorizedError, NotFoundError } from '@/types/errors';
import type { AuthResponse, LoginRequest, SignupRequest } from '@/types/api';
import { env } from '@/utils/env';
import { JwtUtils } from '@/utils/jwt';
import { Logger } from '@/utils/logger';
import { PasswordUtils } from '@/utils/password';
import { Sanitizer } from '@/utils/sanitizer';

export class AuthService {
  static async signup(data: SignupRequest): Promise<AuthResponse> {
    const { name, email, password } = data;

    // Sanitize user inputs
    const sanitizedName = Sanitizer.sanitizeUserInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = (await sql`
      SELECT * FROM users WHERE email = ${sanitizedEmail} LIMIT 1
    `) as unknown as User[];

    if (existingUser.length > 0) {
      throw new ConflictError('User already exists with this email');
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
    const [user] = (await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${sanitizedName}, ${sanitizedEmail}, ${passwordHash})
      RETURNING *
    `) as unknown as User[];

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
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Sanitize email input
    const sanitizedEmail = email.toLowerCase().trim();

    // Find user by email
    const userResult = (await sql`
      SELECT * FROM users WHERE email = ${sanitizedEmail} LIMIT 1
    `) as unknown as User[];

    if (!userResult.length) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await PasswordUtils.comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
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
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  static async getUserById(userId: string): Promise<Omit<User, 'password_hash'>> {
    const userResult = (await sql`
      SELECT id, name, email, created_at, updated_at 
      FROM users 
      WHERE id = ${userId} 
      LIMIT 1
    `) as unknown as Omit<User, 'password_hash'>[];

    if (!userResult.length) {
      throw new NotFoundError('User');
    }

    return userResult[0];
  }
}
