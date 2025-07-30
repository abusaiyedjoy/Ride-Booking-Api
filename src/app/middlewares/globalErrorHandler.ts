import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env"
import { TErrorResource } from './../interfaces/error.types';
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import AppError from "../errorManage/appError";



export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(envVars.NODE_ENV === "development"){
        console.log(err);
    }

    let errorResource: TErrorResource[] = [];
    let statusCode = 500;
    let message = "Something went wrong";

    // Duplicate Error
    if(err.code === 11000){
        const simpleError = handleDuplicateError(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
    }
    // Cast Error
    else if(err.name === "CastError"){
        const simpleError = handleCastError(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
    }
    // Mongoose validation error
    else if(err.name === "ValidationError"){
        const simpleError = handleValidationError(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
        errorResource = simpleError.errorMessages as TErrorResource[];
    }
    else if(err.name === "ZodError"){
        const simpleError = handleZodError(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
        errorResource = simpleError.errorMessages as TErrorResource[];
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errorMessages: errorResource,
        err: envVars.NODE_ENV === "development" ? err : undefined,
        stack: envVars.NODE_ENV === "development" ? err.stack : undefined
    })
}
