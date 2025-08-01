"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorResource = [];
    err.issues.forEach((issue) => {
        errorResource.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        success: false,
        message: "Validation Error",
        errorMessages: errorResource
    };
};
exports.handleZodError = handleZodError;
