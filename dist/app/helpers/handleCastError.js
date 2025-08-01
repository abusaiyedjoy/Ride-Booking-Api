"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return {
        statusCode: 400,
        success: false,
        message,
    };
};
exports.handleCastError = handleCastError;
