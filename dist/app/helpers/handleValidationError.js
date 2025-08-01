"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorResource = [];
    const errors = Object.values(err.errors);
    errors.forEach((error) => {
        errorResource.push({ path: error.path, message: error.message });
    });
    return {
        statusCode: 400,
        success: false,
        message: "Validation Error",
        errorMessages: errorResource
    };
};
exports.handleValidationError = handleValidationError;
