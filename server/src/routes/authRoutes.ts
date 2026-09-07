import { Router } from 'express'

import { register, login } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.get('/protected-test', authMiddleware, (req, res) => {
  res.json({
    message: 'Authentication successful',
    userId: req.userId,
  })
})


export default router