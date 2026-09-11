import type { Request, Response } from 'express'
import User from '../models/User.js'

export async function searchUsers(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: 'Unauthorized',
      })
      return
    }

    const search =
      typeof req.query.search === 'string'
        ? req.query.search.trim()
        : ''

    if (!search) {
      res.status(200).json({
        users: [],
      })
      return
    }

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    })
      .select('_id name email')
      .limit(10)

    res.status(200).json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      })),
    })
  } catch (error) {
    console.error('Search users error:', error)

    res.status(500).json({
      message: 'Failed to search users',
    })
  }
}