import type { Request, Response } from 'express'
import Project from '../models/Project.js'

export async function createProject(
  req: Request,
  res: Response,
) {
 try {
    const { name, description } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        message: 'Project name is required',
      })
    }

    if (!req.userId) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const project = await Project.create({
      name: name.trim(),
      description:
        typeof description === 'string'
          ? description.trim()
          : undefined,
      owner: req.userId,
    })

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    })
  } catch (error) {
    console.error('Create project error:', error)

    return res.status(500).json({
      message: 'Failed to create project',
    })
}
}