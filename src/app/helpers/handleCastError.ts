import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return {
        statusCode: 400,
        success: false,
        message,
    };
    
}