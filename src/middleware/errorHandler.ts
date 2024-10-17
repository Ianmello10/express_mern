import type { NextFunction, Request, Response } from 'express'
import { CustomError } from '../exceptions/customError'
import type { ResponseError } from '../exceptions/customError'
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

    console.error(err)

    //if err is not a custom error throw a generic error
    if (!(err instanceof CustomError)) {

        res.status(500).json({
            message: 'Server error, please try again',
        })
    }

    const customErr = err as CustomError

    const response = {
        message: customErr.message
    } as ResponseError

    if (customErr.additionalDetails) {
        response.additionalDetails = customErr.additionalDetails
    }
    res.status(customErr.status).json(response)


}