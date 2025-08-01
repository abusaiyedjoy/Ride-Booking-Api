"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideZodSchema = void 0;
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
