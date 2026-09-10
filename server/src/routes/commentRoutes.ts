import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import {
  createComment,
  getTaskComments,
  deleteComment,
} from '../controllers/commentController'
  
const router = Router()

router.post(
  '/tasks/:taskId/comments',
  authMiddleware,
  createComment,
)
router.get(
  '/tasks/:taskId/comments',
  authMiddleware,
  getTaskComments,
)
router.delete(
  '/comments/:commentId',
  authMiddleware,
  deleteComment,
)

export default router