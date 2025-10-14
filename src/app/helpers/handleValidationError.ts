import mongoose from "mongoose";
import { TErrorResource, TGenericErrorResponse } from "../interfaces/error.types";


export const handleValidationError = (err:mongoose.Error.ValidationError): TGenericErrorResponse =>{
    const errorResource : TErrorResource[] = [];

    const errors = Object.values(err.errors);
    
    errors.forEach((error: any) => {
        errorResource.push({path: error.path, message: error.message});
    }); 

    return {
        statusCode: 400,
        success: false,
        message: "Validation Error From Error Handaler",
        errorMessages: errorResource
    }
    
}