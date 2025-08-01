"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const driver_interface_1 = require("./driver.interface");
const mongoose_1 = require("mongoose");
const vehicleInfoSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    modelYear: { type: Number, required: true },
    licensePlate: { type: String, required: true },
}, {
    _id: false,
    versionKey: false
});
const locationSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    coordinates: { type: [Number, Number], required: true },
    address: { type: String },
}, {
    _id: false,
    versionKey: false
});
const driverSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    vehicleInfo: { type: vehicleInfoSchema, required: true },
    driverLicenseNumber: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    availability: {
        type: String,
        enum: Object.values(driver_interface_1.IAvailability),
        default: driver_interface_1.IAvailability.OFFLINE
    },
    currentLocation: { type: locationSchema },
    totalEarnings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5 },
    profilePicture: { type: String },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
