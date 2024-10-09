import type { Response, Request } from 'express'
import { LoginService, SignupService } from '../services/authService'
import { generateTokenAndSetCookie } from '../utils/generateTokenCookie'
import { User } from '../models/user.model'

export const signupController = async (req: Request, res: Response) => {

    const signupService = new SignupService()
    const { email, password, name } = req.body

    if (!email || !password || !name) {
        res.status(400).json({

            success: false,
            message: 'All fields are required'
        })
    }

    const user = await signupService.signup(email, password, name)

    generateTokenAndSetCookie(res, user._id.toString())

    res.status(201).json({

        success: true,
        message: 'User created successfully',
        user: {

            //id: user.id,
            email: user.email,
            name: user.name,
        }
    })
}

export const loginController = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body

        const loginService = new LoginService()


        const user = await loginService.login(email, password)



        user.lastLogin = new Date()
        await user.save()
        generateTokenAndSetCookie(res, user._id.toString())

        res.status(200).json({

            success: true,
            message: 'User logged in successfully',
            user: {
                name: user.name,
                email: user.email
            }
        })

    }
    catch (error) {


        if (error instanceof Error) {
            res.status(401).json({
                success: false,
                message: error.message
            })
        } else {

            console.log(error)
        }
    }


}

export const logout = async (req: Request, res: Response) => {

    res.clearCookie('token')
    res.status(200).json({ success: true, message: 'User logged out successfully' })
}



export const profileController = async (req: Request, res: Response) => {

    const userId = req.body.userId
    console.log(userId)

    const user = await User.findById(userId).select('-password')

    if (!user) {

        res.status(400).json({
            success: false,
            message: 'User ID is required'
        })
    }

    res.status(200).json({ success: true, user })
}