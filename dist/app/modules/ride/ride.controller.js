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
exports.RideController = void 0;
const ride_service_1 = require("./ride.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorManage/appError"));
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../user/user.interface");
const driver_model_1 = require("../driverProfile/driver.model");
exports.RideController = {
    requestRide: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pickupLocation, destinationLocation } = req.body;
            const riderUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const newRide = yield ride_service_1.RideService.requestRide(riderUserId, pickupLocation, destinationLocation);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: 'Ride requested successfully. Waiting for a driver to accept.',
                data: newRide,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    acceptRide: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rideId = new mongoose_1.Types.ObjectId(req.params.id);
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const acceptedRide = yield ride_service_1.RideService.acceptRide(rideId, driverUserId);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Ride accepted successfully.',
                data: acceptedRide,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    updateRideStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rideId = new mongoose_1.Types.ObjectId(req.params.id);
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const { status } = req.body;
            const updatedRide = yield ride_service_1.RideService.updateRideStatus(rideId, driverUserId, status);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: `Ride status updated to '${status}'.`,
                data: updatedRide,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    cancelRide: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rideId = new mongoose_1.Types.ObjectId(req.params.id);
            const riderUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const { reason } = req.body;
            const cancelledRide = yield ride_service_1.RideService.cancelRide(rideId, riderUserId, reason);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Ride cancelled successfully.',
                data: cancelledRide,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    adminUpdateRideStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rideId = new mongoose_1.Types.ObjectId(req.params.id);
            const adminUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const { status } = req.body;
            const updatedRide = yield ride_service_1.RideService.adminUpdateRideStatus(rideId, status, adminUserId);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: `Ride status updated to '${status}' by admin.`,
                data: updatedRide,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getRiderRideHistory: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const riderUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const history = yield ride_service_1.RideService.getRiderRideHistory(riderUserId);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Rider ride history fetched successfully.',
                data: history,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getDriverRideHistory: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const history = yield ride_service_1.RideService.getDriverRideHistory(driverUserId);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Driver ride history fetched successfully.',
                data: history,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllRides: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allRides = yield ride_service_1.RideService.getAllRides();
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'All rides fetched successfully.',
                data: allRides,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    findAvailableDrivers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { lat, lng, maxDistanceKm } = req.query;
            const drivers = yield ride_service_1.RideService.findAvailableDrivers(Number(lat), Number(lng), maxDistanceKm ? Number(maxDistanceKm) : undefined);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Available drivers fetched successfully.',
                data: drivers,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getRideById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rideId = new mongoose_1.Types.ObjectId(req.params.id);
            const ride = yield ride_service_1.RideService.getRideById(rideId);
            if (!ride) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Ride not found.');
            }
            const userRole = req.user.role;
            const userId = new mongoose_1.Types.ObjectId(req.user._id);
            if (userRole === user_interface_1.Role.RIDER && !ride.riderId.equals(userId)) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Unauthorized: You can only view your own rides.');
            }
            if (userRole === user_interface_1.Role.DRIVER) {
                const driverProfile = yield driver_model_1.Driver.findOne({ userId });
                if (!driverProfile || !ride.driverId || !ride.driverId.equals(driverProfile._id)) {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Unauthorized: You can only view your own rides.');
                }
            }
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Ride fetched successfully.',
                data: ride,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
