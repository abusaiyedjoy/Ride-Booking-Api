import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env"
import { TErrorResource } from './../interfaces/error.types';



export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(envVars.NODE_ENV === "development"){
        console.log(err);
    }

    let errorResource: TErrorResource[] = [];
    let statusCode = 500;
    let message = "Something went wrong";
}
