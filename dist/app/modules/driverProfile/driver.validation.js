"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverProfileByIdZodSchema = exports.setAvailabilityStatusZodSchema = exports.adminUpdateDriverProfileZodSchema = exports.updateDriverProfileZodSchema = exports.createDriverProfileZodSchema = exports.vehicleInfoZodSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const availabilityOptions = Object.values(driver_interface_1.IAvailability);
exports.locationSchema = zod_1.z.object({
    type: zod_1.z.literal('Point').default('Point'),
    coordinates: zod_1.z.array(zod_1.z.number()).length(2, "Coordinates must be an array of [longitude, latitude]").refine((coords) => {
        const [lng, lat] = coords;
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    }, "Invalid longitude or latitude values. Longitude must be between -180 and 180, Latitude between -90 and 90."),
    address: zod_1.z.string().min(1, "Address cannot be empty").optional(),
});
exports.vehicleInfoZodSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, "Vehicle type is required"),
    make: zod_1.z.string().min(1, "Vehicle make is required"),
    model: zod_1.z.string().min(1, "Vehicle model is required"),
    color: zod_1.z.string().min(1, "Vehicle color is required"),
    modelYear: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1, "Invalid vehicle model year"),
    licensePlate: zod_1.z.string().min(1, "License plate is required").max(20, "License plate too long"),
});
exports.createDriverProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid User ID format"),
        vehicleInfo: exports.vehicleInfoZodSchema,
        driverLicenseNumber: zod_1.z.string().min(1, "Driver license number is required").max(50, "Driver license number too long"),
        phoneNumber: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL format for profile picture").optional(),
    }),
});
exports.updateDriverProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleInfo: exports.vehicleInfoZodSchema.partial().optional(),
        driverLicenseNumber: zod_1.z.string().min(1, "Driver license number cannot be empty").max(50).optional(),
        phoneNumber: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL format for profile picture").optional(),
    }).partial(),
});
exports.adminUpdateDriverProfileZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Driver Profile ID format"),
    }),
    body: zod_1.z.object({
        isApproved: zod_1.z.boolean().optional(),
        isSuspended: zod_1.z.boolean().optional(),
        availability: zod_1.z.enum(Object.values(availabilityOptions)).optional(),
        totalEarnings: zod_1.z.number().min(0).optional(),
        averageRating: zod_1.z.number().min(1).max(5).optional(),
    }).partial(),
});
exports.setAvailabilityStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(availabilityOptions)),
        currentLocation: exports.locationSchema.optional(),
    }).refine((data) => {
        if (data.status === driver_interface_1.IAvailability.ONLINE && !data.currentLocation) {
            return false;
        }
        return true;
    }, {
        message: "currentLocation is required when setting availability to 'Online'",
        path: ["currentLocation"],
    }),
});
exports.getDriverProfileByIdZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Driver Profile ID format"),
    }),
});
