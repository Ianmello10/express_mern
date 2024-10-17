import {Router} from 'express'
import UserController from '../controllers/userController'
import { asyncHandler } from '../middleware/asyncHandler'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

router.get('/', verifyToken,asyncHandler(UserController.listAll))
router.get('/:id([0-9a-z]{24})', verifyToken, asyncHandler(UserController.getById))
router.post('/', asyncHandler(UserController.newUser))
router.patch('/:id([0-9a-z]{24})', verifyToken, asyncHandler(UserController.editUser))
router.delete('/:id([0-9a-z]{24})',verifyToken, asyncHandler(UserController.deleteUser))


export default router