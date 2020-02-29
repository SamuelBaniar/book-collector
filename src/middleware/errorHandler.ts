import { NextFunction, Request, Response } from 'express';
import ApiException from '../exceptions/ApiException';
 
function errorMiddleware(error: ApiException, request: Request, response: Response, next: NextFunction) {
    const status = error.status;
    const message = error.message;

    response
        .status(status)
        .send({
        status,
        message,
    })
}
 
export default errorMiddleware;