"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverProfileSchema = exports.locationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const driver_interface_1 = require("./driver.interface");
const vehicleInfoSchema = zod_1.default.object({
    make: zod_1.default.string().min(1, "Vehicle make is required"),
    model: zod_1.default.string().min(1, "Vehicle model is required"),
    year: zod_1.default.number().int().min(1900).max(new Date().getFullYear() + 1, "Invalid vehicle year"),
    licensePlate: zod_1.default.string().min(1, "License plate is required").max(20, "License plate too long"),
    color: zod_1.default.string().min(1, "Vehicle color is required"),
    type: zod_1.default.enum(['BIKE', 'CAR']).default('BIKE'),
});
exports.locationSchema = zod_1.default.object({
    type: zod_1.default.literal('Point').default('Point'),
    coordinates: zod_1.default.array(zod_1.default.number()).length(2, "Coordinates must be an array of [longitude, latitude]"),
    address: zod_1.default.string().min(1, "Address cannot be empty").optional(),
});
exports.driverProfileSchema = zod_1.default.object({
    userId: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid User ID format").optional(),
    vehicleInfo: vehicleInfoSchema,
    driverLicenseNumber: zod_1.default.string().min(1, "Driver license number is required").max(50, "Driver license number too long"),
    isApproved: zod_1.default.boolean().default(false).optional(),
    isSuspended: zod_1.default.boolean().default(false).optional(),
    availabilityStatus: zod_1.default.enum(Object.values(driver_interface_1.IAvailability)).default(driver_interface_1.IAvailability.OFFLINE).optional(),
    currentLocation: exports.locationSchema.optional(),
    totalEarnings: zod_1.default.number().min(0).default(0).optional(),
    averageRating: zod_1.default.number().min(1).max(5).default(5).optional(),
    profilePicture: zod_1.default.string().url("Invalid URL format for profile picture").optional(),
    phoneNumber: zod_1.default.string().optional(),
});
