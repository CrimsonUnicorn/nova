import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { 
    createTask,
    deleteTask,
    getProjectTasks, 
    getTaskById, 
    updateTask, 
    assignTask } from '../controllers/taskController.js'

const router = Router()

router.post('/', authMiddleware, createTask)
router.get('/projects/:projectId', authMiddleware, getProjectTasks)
router.get('/:id', authMiddleware, getTaskById)
router.put('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)
router.put('/:id/assign', authMiddleware, assignTask)

export default router
