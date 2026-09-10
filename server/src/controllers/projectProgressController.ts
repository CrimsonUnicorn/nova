import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project'
import Task from '../models/Task'
import { calculateProjectProgress } from '../utils/projectProgress'

export async function getProjectProgress(
    req: Request,
    res: Response,
) {
    try {
        const userId = req.userId

        const projectId = Array.isArray(req.params.projectId)
            ? req.params.projectId[0]
            : req.params.projectId

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID',
            })
        }

        const project = await Project.findOne({
            _id: projectId,
            $or: [
                { owner: userId },
                { members: userId },
            ],
        })

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            })
        }

        const tasks = await Task.find({
            project: projectId,
        })

        const totalTasks = tasks.length

        const completedTasks = tasks.filter(
            (task) => task.status === 'completed',
        ).length

        const progress = calculateProjectProgress(
            totalTasks,
            completedTasks,
        )

        return res.status(200).json({
            progress,
            totalTasks,
            completedTasks,
        })
    } catch (error) {
        console.error('Get project progress error:', error)

        return res.status(500).json({
            message: 'Failed to get project progress',
        })
    }
}