import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Response, Request, NextFunction } from 'express'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {

    const token = req.cookies.token
    console.log(token, 'token')

    if (!token) { return res.status(401).json({ success: false, message: 'Unauthorized token is required' }) }

    try {

        const decoded = jwt.verify(token, process.env.JWT as string) as JwtPayload

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' })
        }



        req.body.userId = decoded.userId
        return next()

    } catch (error) {

        console.log(error)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }

}