"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorManage/appError"));
const ride_model_1 = require("./ride.model");
const user_interface_1 = require("../user/user.interface");
const driver_model_1 = require("../driverProfile/driver.model");
exports.RideService = {
    requestRide: (riderId, pickupLocation, destinationLocation) => __awaiter(void 0, void 0, void 0, function* () {
        const isRiderExist = yield user_model_1.User.findById(riderId);
        if (!isRiderExist) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rider not found.");
        }
        const riderUserId = isRiderExist._id;
        const activeRide = yield ride_model_1.Ride.findOne({
            riderId: riderUserId,
            status: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        });
        if (activeRide) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already have an active ride. Please complete or cancel it first.");
        }
        const newRide = new ride_model_1.Ride({
            riderId: riderUserId,
            pickupLocation,
            destinationLocation,
            status: "REQUESTED",
            requestedAt: new Date(),
        });
        yield newRide.save();
        return newRide;
    }),
    acceptRide: (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride request not found.");
        }
        if (ride.status !== "REQUESTED") {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This ride cannot be accepted. It is no longer in "requested" status.');
        }
        if (ride.driverId) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "This ride has already been accepted by another driver.");
        }
        const driverUser = yield user_model_1.User.findById(driverId);
        if (!driverUser || driverUser.role !== user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver not found or account is blocked/not a driver.");
        }
        const driverProfile = yield driver_model_1.Driver.findOne({ userId: driverId });
        if (!driverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver profile not found.");
        }
        if (!driverProfile.isApproved) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver is not approved to accept rides.");
        }
        if (driverProfile.isSuspended) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Driver account is suspended and cannot accept rides.");
        }
        if (driverProfile.availability !== "ONLINE") {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Driver is not online and cannot accept rides.");
        }
        const activeDriverRide = yield ride_model_1.Ride.findOne({
            driverId: driverProfile._id,
            status: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        });
        if (activeDriverRide) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Driver is already on an active ride.");
        }
        ride.driverId = driverProfile._id;
        ride.status = "ACCEPTED";
        ride.acceptedAt = new Date();
        yield ride.save();
        return ride;
    }),
    updateRideStatus: (rideId, driverId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found.");
        }
        const driverProfile = yield driver_model_1.Driver.findOne({ userId: driverId });
        if (!driverProfile ||
            !ride.driverId ||
            !ride.driverId.equals(driverProfile._id)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized: You are not the driver for this ride.");
        }
        const currentStatus = ride.status;
        switch (newStatus) {
            case "PICKED_UP":
                if (currentStatus !== "ACCEPTED") {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride must be in "accepted" status to be picked up.');
                }
                ride.pickedUpAt = new Date();
                break;
            case "IN_TRANSIT":
                if (currentStatus !== "PICKED_UP") {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride must be in "picked_up" status to be in transit.');
                }
                ride.inTransitAt = new Date();
                break;
            case "COMPLETED":
                if (currentStatus !== "IN_TRANSIT") {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride must be in "in_transit" status to be completed.');
                }
                ride.completedAt = new Date();
                driverProfile.totalEarnings += ride.fare || 0;
                yield driverProfile.save();
                break;
            default:
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid new status provided.");
        }
        ride.status = newStatus;
        yield ride.save();
        return ride;
    }),
    cancelRide: (rideId, riderId, cancellationReason) => __awaiter(void 0, void 0, void 0, function* () {
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found.");
        }
        if (!ride.riderId.equals(riderId)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Unauthorized: You are not the rider for this ride.");
        }
        const currentStatus = ride.status;
        const now = new Date();
        const cancellationWindowMinutes = 5;
        if (currentStatus === "REQUESTED") {
            // Always allow cancellation if still requested
        }
        else if (currentStatus === "ACCEPTED") {
            if (!ride.acceptedAt ||
                (now.getTime() - ride.acceptedAt.getTime()) / (1000 * 60) >
                    cancellationWindowMinutes) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Cancellation not allowed after ${cancellationWindowMinutes} minutes of acceptance.`);
            }
        }
        else if ([
            "PICKED_UP",
            "IN_TRANSIT",
            "COMPLETED",
            "CANCELLED",
            "NO_DRIVER_FOUND",
        ].includes(currentStatus)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Ride cannot be cancelled in "${currentStatus}" status.`);
        }
        ride.status = "CANCELLED";
        ride.cancelledAt = now;
        ride.cancellationReason = cancellationReason || "Rider cancelled";
        yield ride.save();
        return ride;
    }),
    adminUpdateRideStatus: (rideId, newStatus, adminId) => __awaiter(void 0, void 0, void 0, function* () {
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found.");
        }
        const now = new Date();
        switch (newStatus) {
            case "REQUESTED":
                if (!ride.requestedAt)
                    ride.requestedAt = now;
                break;
            case "ACCEPTED":
                if (!ride.acceptedAt)
                    ride.acceptedAt = now;
                break;
            case "PICKED_UP":
                if (!ride.pickedUpAt)
                    ride.pickedUpAt = now;
                break;
            case "IN_TRANSIT":
                if (!ride.inTransitAt)
                    ride.inTransitAt = now;
                break;
            case "COMPLETED":
                if (!ride.completedAt)
                    ride.completedAt = now;
                break;
            case "CANCELLED":
                if (!ride.cancelledAt)
                    ride.cancelledAt = now;
                break;
            case "NO_DRIVER_FOUND":
                break;
        }
        ride.status = newStatus;
        yield ride.save();
        return ride;
    }),
    getRiderRideHistory: (riderId) => __awaiter(void 0, void 0, void 0, function* () {
        const riderUser = yield user_model_1.User.findById(riderId);
        if (!riderUser || riderUser.role !== user_interface_1.Role.RIDER) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rider not found.");
        }
        return ride_model_1.Ride.find({ riderId: riderId }).sort({ requestedAt: -1 });
    }),
    getDriverRideHistory: (driverId) => __awaiter(void 0, void 0, void 0, function* () {
        const driverProfile = yield driver_model_1.Driver.findOne({ userId: driverId });
        if (!driverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver profile not found.");
        }
        return ride_model_1.Ride.find({ driverId: driverProfile._id }).sort({ requestedAt: -1 });
    }),
    getAllRides: () => __awaiter(void 0, void 0, void 0, function* () {
        return ride_model_1.Ride.find().sort({ requestedAt: -1 });
    }),
    findAvailableDrivers: (latitude_1, longitude_1, ...args_1) => __awaiter(void 0, [latitude_1, longitude_1, ...args_1], void 0, function* (latitude, longitude, maxDistanceKm = 10) {
        return driver_model_1.Driver.find({
            isApproved: true,
            isSuspended: false,
            availabilityStatus: "ONLINE",
            currentLocation: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: maxDistanceKm * 1000,
                },
            },
        });
    }),
    getRideById: (rideId) => __awaiter(void 0, void 0, void 0, function* () {
        return ride_model_1.Ride.findById(rideId);
    }),
};
