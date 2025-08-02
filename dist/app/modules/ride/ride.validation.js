"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRideByIdZodSchema = exports.findAvailableDriversZodSchema = exports.adminUpdateRideStatusZodSchema = exports.cancelRideZodSchema = exports.updateRideStatusZodSchema = exports.acceptRideZodSchema = exports.requestRideZodSchema = exports.rideZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = require("mongoose");
const driver_validation_1 = require("../driverProfile/driver.validation");
const ride_interface_1 = require("./ride.interface");
exports.rideZodSchema = zod_1.default.object({
    riderId: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Rider ID format"),
    driverId: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Driver ID format").optional(),
    pickupLocation: driver_validation_1.locationSchema,
    destinationLocation: driver_validation_1.locationSchema,
    acceptedAt: zod_1.default.string().datetime().optional(),
    pickedUpAt: zod_1.default.string().datetime().optional(),
    inTransitAt: zod_1.default.string().datetime().optional(),
    completedAt: zod_1.default.string().datetime().optional(),
    cancelledAt: zod_1.default.string().datetime().optional(),
    status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)).default(ride_interface_1.RideStatus.REQUESTED),
    fare: zod_1.default.number().min(0).optional(),
    cancellationReason: zod_1.default.string().min(1, "Cancellation reason cannot be empty").optional(),
    riderRating: zod_1.default.number().min(1).max(5).optional(),
    driverRating: zod_1.default.number().min(1).max(5).optional(),
});
exports.requestRideZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        pickupLocation: driver_validation_1.locationSchema,
        destinationLocation: driver_validation_1.locationSchema,
    }),
});
exports.acceptRideZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Ride ID format"),
    }),
    body: zod_1.default.object({}).strict().optional(),
});
exports.updateRideStatusZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Ride ID format"),
    }),
    body: zod_1.default.object({
        status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)),
    })
});
exports.cancelRideZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Ride ID format"),
    }),
    body: zod_1.default.object({
        reason: zod_1.default.string().min(1, "Cancellation reason cannot be empty").optional(),
    }),
});
exports.adminUpdateRideStatusZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Ride ID format"),
    }),
    body: zod_1.default.object({
        status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)),
    }),
});
exports.findAvailableDriversZodSchema = zod_1.default.object({
    query: zod_1.default.object({
        lat: zod_1.default.string().transform(Number).refine(val => !isNaN(val) && val >= -90 && val <= 90, "Invalid latitude. Must be a number between -90 and 90."),
        lng: zod_1.default.string().transform(Number).refine(val => !isNaN(val) && val >= -180 && val <= 180, "Invalid longitude. Must be a number between -180 and 180."),
        maxDistanceKm: zod_1.default.string().transform(Number).refine(val => !isNaN(val) && val > 0, "Invalid maxDistanceKm. Must be a positive number.").optional(),
    }),
});
exports.getRideByIdZodSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().refine(val => mongoose_1.Types.ObjectId.isValid(val), "Invalid Ride ID format"),
    }),
});
