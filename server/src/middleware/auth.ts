import type {Response, NextFunction} from 'express'
import {sql} from '@/db'
import type {User} from '@/db'
import {JwtUtils} from '@/utils/jwt'
import {ResponseUtils} from '@/utils/response'
import {Logger} from '@/utils/logger'
import type {AuthenticatedRequest} from '@/types/api'

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = JwtUtils.getTokenFromHeader(req.headers.authorization)

    if (!token) {
      ResponseUtils.unauthorized(res, 'No token provided')
      return
    }

    const payload = JwtUtils.verifyToken(token)
    const user = await sql`
      SELECT * FROM users WHERE id = ${payload.userId} LIMIT 1
    ` as User[]

    if (!user.length) {
      ResponseUtils.unauthorized(res, 'User not found')
      return
    }

    req.user = user[0]
    next()
  } catch (error) {
    const err = error as any
    Logger.error('Authentication error', {error: err.message})
    ResponseUtils.unauthorized(res, 'Invalid or expired token')
  }
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = JwtUtils.getTokenFromHeader(req.headers.authorization)

    if (!token) {
      next()
      return
    }

    const payload = JwtUtils.verifyToken(token)
    const user = await sql`
      SELECT * FROM users WHERE id = ${payload.userId} LIMIT 1
    ` as User[]

    if (user.length) {
      req.user = user[0]
    }

    next()
  } catch (error) {
    const err = error as any
    Logger.warn('Optional authentication failed', {error: err.message})
    next()
  }
}
