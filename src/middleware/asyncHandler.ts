import type { NextFunction, Request, Response } from "express";

/**
 *   
 * Async handler to allow handling async routes
 * 
 * Higher order function , fn is  midleware function that will handle req res and next
 * @returns Promise
**/
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction) => {

    // ensure that it is returning a promise and if promise is rejected then catch this error
    return Promise.resolve(fn(req, res, next)).catch(next)

}



