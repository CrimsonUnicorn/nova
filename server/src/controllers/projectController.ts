import type { Request, Response } from 'express'
import Project from '../models/Project.js'
import mongoose from 'mongoose'

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

export async function getProjects(
    req: Request,
    res: Response,
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: 'Authentication required',
            })
        }

        const projects = await Project.find({
            owner: req.userId,
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            projects,
        })
    } catch (error) {
        console.error('Get projects error:', error)

        return res.status(500).json({
            message: 'Failed to fetch projects',
        })
    }
}

export async function getProjectById(
  req: Request,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    return res.status(200).json({
      project,
    })
  } catch (error) {
    console.error('Get project error:', error)

    return res.status(500).json({
      message: 'Failed to fetch project',
    })
  }
}

export async function updateProject(
  req: Request,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const { id } = req.params
    const { name, description } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    if (
      name !== undefined &&
      (typeof name !== 'string' || !name.trim())
    ) {
      return res.status(400).json({
        message: 'Project name cannot be empty',
      })
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    if (name !== undefined) {
      project.name = name.trim()
    }

    if (description !== undefined) {
      project.description =
        typeof description === 'string'
          ? description.trim()
          : undefined
    }

    await project.save()

    return res.status(200).json({
      message: 'Project updated successfully',
      project,
    })
  } catch (error) {
    console.error('Update project error:', error)

    return res.status(500).json({
      message: 'Failed to update project',
    })
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await Project.findOneAndDelete({
      _id: id,
      owner: req.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    return res.status(200).json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Delete project error:', error)

    return res.status(500).json({
      message: 'Failed to delete project',
    })
  }
}

export async function addProjectMember(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params
    const { userId } = req.body

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid project ID' })
      return
    }

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ message: 'Invalid user ID' })
      return
    }

    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.userId,
    })

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }
    
    if (req.userId === userId) {
  res.status(400).json({
    message: 'Project owner cannot be added as a member',
  })
  return
}

    if (project.members.some((member) => member.toString() === userId)) {
      res.status(400).json({ message: 'User is already a project member' })
      return
    }

    project.members.push(new mongoose.Types.ObjectId(userId))
    await project.save()

    res.status(200).json(project)
  } catch (error) {
    console.error('Add project member error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function getProjectMembers(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid project ID' })
      return
    }

    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.userId,
    }).populate('members', 'name email')

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }

    res.status(200).json(project.members)
  } catch (error) {
    console.error('Get project members error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function removeProjectMember(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id, userId } = req.params

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid project ID' })
      return
    }

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({ message: 'Invalid user ID' })
      return
    }

    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const project = await Project.findOne({
      _id: id,
      owner: req.userId,
    })

    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    }

    const memberExists = project.members.some(
      (member) => member.toString() === userId,
    )

    if (!memberExists) {
      res.status(404).json({
        message: 'User is not a project member',
      })
      return
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId,
    )

    await project.save()

    res.status(200).json({
      message: 'Project member removed successfully',
    })
  } catch (error) {
    console.error('Remove project member error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

