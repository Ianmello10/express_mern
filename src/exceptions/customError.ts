
/**
 * 
 * Custom error class inherits from native Error class
 * @argument {string} message - message for error
 * @argument {number} statusCode - status code for error
 */
export class CustomError extends Error {

    message!: string;
    status!:number;
    additionalDetails!:string;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    constructor(message:string, status = 500, additionalDetails:any = undefined){

        super(message)
        this.status = status
        this.additionalDetails = additionalDetails
    }

}

export interface ResponseError {
    message: string,
   additionalDetails: string
}