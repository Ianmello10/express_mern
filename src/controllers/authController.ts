import type { Response, Request } from 'express'
import { LoginService, SignupService } from '../services/authService'
import { generateAccessToken } from '../utils/generateAccessToken'
import type { User } from '../models/user.model'
import { object, z } from "zod";
import { CustomError } from '../exceptions/customError';
import { generateRefreshToken } from '../utils/genereateRefreshToken';

const userSchema = z.object({

    email: z.string().email(),
    password: z.string(),
    name: z.string(),
})


// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class AuthController {

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            if (!email || !password) throw new CustomError('All fields are required!', 400)


            const user = await LoginService.login(email, password)
            const userObject = user?.toObject() as User
            const { password: _, ...userParsed } = userObject


            user.lastLogin = new Date()
            await user.save()
            const { refreshToken } = generateRefreshToken(res, user._id.toString())
            generateAccessToken(res, user._id.toString())


            res.status(200).cookie('token', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
            }).json({

                success: true,
                message: 'User logged in successfully',
                user: userParsed,
            })



        }
        catch (error) {

            if (error instanceof CustomError) {
                res.status(error.status).json({
                    success: false,
                    message: error.message

                })
            } else {

                res.status(500).json({
                    success: false,
                    message: 'Server error, please try again'
                })
            }
        }


    }




    static logout = async (req: Request, res: Response) => {

        res.clearCookie('token')
        res.header('Authorization', '')
        res.status(200).json({ success: true, message: 'User logged out successfully' })
    }



    static refreshToken = async (req: Request, res: Response) => {

        const accessToken = generateAccessToken(res, req.body.userId)

        if (!accessToken) throw new CustomError('Refresh token is required', 400)

        res.json({

            success: true,
            message: 'Token refreshed successfully',
        })


    }

    /*
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
    */
}

export default AuthController
