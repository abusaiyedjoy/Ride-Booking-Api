import { TGenericErrorResponse } from "../interfaces/error.types";
import { TErrorResource } from './../interfaces/error.types';


export const handleZodError = (err:any): TGenericErrorResponse => {
    const errorResource : TErrorResource[] = [];

    err.issues.forEach((issue: any) => {
        errorResource.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });

    return {
        statusCode: 400,
        success: false,
        message: "Zod Validation Error",
        errorMessages: errorResource
    };
}