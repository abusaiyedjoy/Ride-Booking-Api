"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const RideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Rider", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    requestedAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    status: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.REQUESTED },
    fare: { type: Number },
    cancellationReason: { type: String },
    riderRating: { type: Number },
    driverRating: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});
exports.Ride = (0, mongoose_1.model)("Ride", RideSchema);
