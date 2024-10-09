import express from 'express'
import { loginController, logout, profileController, signupController } from '../controllers/authController'
import { verifyToken } from '../middleware/verifyToken'


const router = express.Router()

router.post('/signup', signupController)
router.post('/login', loginController)
router.post('/logout', logout)
router.get('/profile',verifyToken,profileController)



export default router