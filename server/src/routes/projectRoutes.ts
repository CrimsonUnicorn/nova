import { Router } from 'express'

import { authMiddleware } from '../middleware/authMiddleware.js'
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from '../controllers/projectController.js'
import { getProjectProgress } from '../controllers/projectProgressController.js'

const router = Router()

router.post('/', authMiddleware, createProject)
router.get('/', authMiddleware, getProjects)
router.get('/:id', authMiddleware, getProjectById)
router.put('/:id', authMiddleware, updateProject)
router.delete('/:id', authMiddleware, deleteProject)

router.post('/:id/members', authMiddleware, addProjectMember)
router.get('/:id/members', authMiddleware, getProjectMembers)
router.delete(
  '/:id/members/:userId',
  authMiddleware,
  removeProjectMember,
)
router.get(
  '/:projectId/progress',
  authMiddleware,
  getProjectProgress,
)

export default router