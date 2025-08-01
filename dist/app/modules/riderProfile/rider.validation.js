"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riderProfileSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
exports.riderProfileSchema = zod_1.default.object({
    userId: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid User ID format").optional(),
    paymentMethod: zod_1.default.string().optional(),
    locations: zod_1.default.string().optional(),
    picture: zod_1.default.string().url("Invalid URL format for profile picture").optional(),
    phone: zod_1.default.string().optional(),
});
