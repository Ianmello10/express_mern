import type { NextFunction, Request, Response } from "express";
import { ClientError } from "../exceptions/clientError";
import { NotFoundError } from "../exceptions/notFoundError";
import { User } from "../models/user.model";
import { SignupService } from "../services/authService";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class UserController {

    static listAll = async (req: Request, res: Response, next: NextFunction) => {

        const users = await User.find().select(['_id', 'name', 'email'])

        res.status(200).json({
            message: 'Users retrieved successfully',
            users
        })
    }

    static getById = async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params.id
        const user = await User.findById(id).select(['_id', 'name', 'email'])

        if (!user) throw new NotFoundError(`User with id ${id} not found`)

        res.status(200).json({

            message: 'User retrieved successfully',
            user
        })
    }


    static newUser = async (req: Request, res: Response, next: NextFunction) => {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            throw new ClientError('All fields are required')
        }

        try {
            const user = await SignupService.signup(email, password, name)


            if (!user) throw new ClientError('Error creating user')


            const userObject = user?.toObject() as User

            const { password: _, ...userParsed } = userObject


            res.status(201).json({
                message: 'User created successfully',
                user: userParsed
            })

        } catch (error) {


            console.log(error)

            res.status(500).json({
                message: 'Server error, please try again',
                error: (error as Error).message
            })

        }



    }

    static editUser = async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params.id
        const { name, email } = req.body

        if (!name || !email) {
            throw new ClientError('All fields are required')
        }

        const user = await User.findById(id).select(['_id', 'name', 'email'])
        if (!user) throw new NotFoundError(`User with id ${id} not found`)

        if (name) user.name = name
    }

    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params.id

        const user = await User.findById(id).select(['_id', 'name', 'email'])
        if (!user) throw new NotFoundError(`User with id ${id} not found`)

        await user.deleteOne({ _id: id })

        res.status(204).json({

            message: 'User deleted successfully',
        })
    }
}

export default UserController