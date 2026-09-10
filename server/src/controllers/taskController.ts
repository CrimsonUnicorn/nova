import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import Task from '../models/Task.js'
import Project from '../models/Project.js'

async function getAuthorizedProject(
    projectId: mongoose.Types.ObjectId,
    userId: string,
) {
    return Project.findOne({
        _id: projectId,
        $or: [
            { owner: userId },
            { members: userId },
        ],
    })
}

export async function createTask(req: Request, res: Response) {
    try {
        const { title, description, status, priority, project, assignedTo, dueDate } =
            req.body


        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        if (!title || !project) {
            return res.status(400).json({
                message: 'Title and project are required',
            })
        }

        if (!mongoose.Types.ObjectId.isValid(project)) {
            return res.status(400).json({
                message: 'Invalid project ID',
            })
        }

        const existingProject = await Project.findOne({
            _id: project,
            $or: [
                { owner: req.userId },
                { members: req.userId },
            ],
        })

        if (!existingProject) {
            return res.status(404).json({
                message: 'Project not found',
            })
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            project,
            assignedTo,
            dueDate,
        })

        return res.status(201).json({
            message: 'Task created successfully',
            task,
        })

    } catch (error) {
        console.error('Create task error:', error)

        return res.status(500).json({
            message: 'Failed to create task',
        })

    }
}

export async function getProjectTasks(req: Request, res: Response) {
    try {
        const projectId = Array.isArray(req.params.projectId)
            ? req.params.projectId[0]
            : req.params.projectId
        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID',
            })
        }
        const project = await Project.findOne({
            _id: projectId,
            $or: [
                { owner: req.userId },
                { members: req.userId },
            ],
        })
        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            })
        }
        const tasks = await Task.find({
            project: projectId,
        }).sort({ createdAt: -1 })
        return res.status(200).json({
            tasks,
        })

    } catch (error) {
        console.error('Get project tasks error:', error)
        return res.status(500).json({
            message: 'Failed to get project tasks',
        })
    }
}

export async function getTaskById(req: Request, res: Response) {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id

        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            })
        }

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        const project = await Project.findOne({
            _id: task.project,
            $or: [
                { owner: req.userId },
                { members: req.userId },
            ],
        })

        if (!project) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        return res.status(200).json({
            task,
        })
    } catch (error) {
        console.error('Get task error:', error)

        return res.status(500).json({
            message: 'Failed to get task',
        })
    }
}

export async function updateTask(req: Request, res: Response) {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id

        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            dueDate,
        } = req.body

        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            })
        }

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        const project = await Project.findOne({
            _id: task.project,
            $or: [
                { owner: req.userId },
                { members: req.userId },
            ],
        })

        if (!project) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: 'Title cannot be empty',
                })
            }

            task.title = title.trim()
        }

        if (description !== undefined) {
            task.description = description
        }

        if (status !== undefined) {
            if (!['todo', 'in-progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status',
                })
            }

            task.status = status
        }

        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    message: 'Invalid priority',
                })
            }

            task.priority = priority
        }

        if (assignedTo !== undefined) {
            if (
                assignedTo !== null &&
                !mongoose.Types.ObjectId.isValid(assignedTo)
            ) {
                return res.status(400).json({
                    message: 'Invalid assigned user ID',
                })
            }

            task.assignedTo = assignedTo || undefined
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate || undefined
        }

        await task.save()

        return res.status(200).json({
            message: 'Task updated successfully',
            task,
        })
    } catch (error) {
        console.error('Update task error:', error)

        return res.status(500).json({
            message: 'Failed to update task',
        })
    }
}

export async function deleteTask(req: Request, res: Response) {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id

        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            })
        }

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        const project = await Project.findOne({
            _id: task.project,
            owner: req.userId,
        })

        if (!project) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        await Task.findByIdAndDelete(taskId)

        return res.status(200).json({
            message: 'Task deleted successfully',
        })
    } catch (error) {
        console.error('Delete task error:', error)

        return res.status(500).json({
            message: 'Failed to delete task',
        })
    }
}
export async function assignTask(req: Request, res: Response) {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id

        const { userId } = req.body

        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID',
            })
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID',
            })
        }

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        const project = await Project.findOne({
            _id: task.project,
            owner: req.userId,
        })

        if (!project) {
            return res.status(404).json({
                message: 'Task not found',
            })
        }

        const isMember = project.members.some(
            (memberId) => memberId.toString() === userId,
        )

        if (!isMember) {
            return res.status(400).json({
                message: 'User is not a member of this project',
            })
        }

        task.assignedTo = new mongoose.Types.ObjectId(userId)

        await task.save()

        return res.status(200).json({
            message: 'Task assigned successfully',
            task,
        })
    } catch (error) {
        console.error('Assign task error:', error)

        return res.status(500).json({
            message: 'Failed to assign task',
        })
    }
}
