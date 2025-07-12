import jwt from 'jsonwebtoken'
import {env} from './env'

export interface JwtPayload {
  userId: string
  email: string
}

export class JwtUtils {
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
      return decoded
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  static getTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }
}
