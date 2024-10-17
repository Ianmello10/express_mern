import { CustomError } from "./customError";

export class ClientError extends CustomError {

    // Permission denied 
    constructor(message: string) {
        super(message, 403)
    }
}