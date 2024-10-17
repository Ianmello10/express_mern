import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'


// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction): any => {

    const refreshToken = <string>req.cookies.token


    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Missing or invalid token' });
    }

    try {

        const jwtPayLoad = jwt.verify(refreshToken, process.env.PRIVATE_KEY as string, {
            algorithms: ['HS256'],
            audience: 'http://localhost:3000',
            issuer: 'http://localhost:3000',
            clockTolerance: 5,
            ignoreExpiration: false,
        }) as JwtPayload

        req.body.userId = jwtPayLoad.userId

        next()
    } catch (error) {


        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ success: false, message: 'Invalid token or expired' });
        } else {
            console.error('Erro na verificação do token:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}

