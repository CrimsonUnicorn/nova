import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Comment from '../models/Comment'
import Task from '../models/Task'
import Project from '../models/Project'

export async function createComment(
  req: Request,
  res: Response,
) {
  try {
    const taskId = Array.isArray(req.params.taskId)
      ? req.params.taskId[0]
      : req.params.taskId

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const { content } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: 'Comment content is required',
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
        { owner: userId },
        { members: userId },
      ],
    })

    if (!project) {
      return res.status(403).json({
        message: 'You are not a member of this project',
      })
    }

    const comment = await Comment.create({
      content: content.trim(),
      task: task._id,
      author: userId,
    })

    const populatedComment = await comment.populate(
      'author',
      'name email',
    )

    return res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment,
    })
  } catch (error) {
    console.error('Create comment error:', error)

    return res.status(500).json({
      message: 'Failed to create comment',
    })
  }
}

export async function getTaskComments(
  req: Request,
  res: Response,
) {
  try {
    const taskId = Array.isArray(req.params.taskId)
      ? req.params.taskId[0]
      : req.params.taskId

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
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
        { owner: userId },
        { members: userId },
      ],
    })

    if (!project) {
      return res.status(403).json({
        message: 'You are not a member of this project',
      })
    }

    const comments = await Comment.find({
      task: taskId,
    })
      .populate('author', 'name email')
      .sort({ createdAt: 1 })

    return res.status(200).json({
      comments,
    })
  } catch (error) {
    console.error('Get task comments error:', error)

    return res.status(500).json({
      message: 'Failed to load task comments',
    })
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
) {
  try {
    const commentId = Array.isArray(req.params.commentId)
      ? req.params.commentId[0]
      : req.params.commentId

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: 'Invalid comment ID',
      })
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      })
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        message: 'You can only delete your own comments',
      })
    }

    const task = await Task.findById(comment.task)

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: userId },
        { members: userId },
      ],
    })

    if (!project) {
      return res.status(403).json({
        message: 'You are not a member of this project',
      })
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json({
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Delete comment error:', error)

    return res.status(500).json({
      message: 'Failed to delete comment',
    })
  }
}