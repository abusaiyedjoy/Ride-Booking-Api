"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const handleZodError_1 = require("../helpers/handleZodError");
const appError_1 = __importDefault(require("../errorManage/appError"));
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let errorResource = [];
    let statusCode = 500;
    let message = "Something went wrong";
    // Duplicate Error
    if (err.code === 11000) {
        const simpleError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
    }
    // Cast Error
    else if (err.name === "CastError") {
        const simpleError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
    }
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        const simpleError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
        errorResource = simpleError.errorMessages;
    }
    else if (err.name === "ZodError") {
        const simpleError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simpleError.statusCode;
        message = simpleError.message;
        errorResource = simpleError.errorMessages;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errorMessages: errorResource,
        err: env_1.envVars.NODE_ENV === "development" ? err : undefined,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : undefined
    });
};
exports.globalErrorHandler = globalErrorHandler;
