import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      return res.status(500).json({
        message: 'JWT_SECRET is not configured',
      })
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload

    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error('Authentication error:', error)

    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}