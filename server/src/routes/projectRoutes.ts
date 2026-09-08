import { Router } from 'express'

import { authMiddleware } from '../middleware/authMiddleware.js'
import { createProject } from '../controllers/projectController.js'

const router = Router()

router.post('/', authMiddleware, createProject)

export default router