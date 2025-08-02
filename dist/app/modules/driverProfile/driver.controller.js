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
exports.DriverController = void 0;
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errorManage/appError"));
exports.DriverController = {
    createDriverProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, vehicleInfo, driverLicenseNumber, phoneNumber, profilePicture } = req.body;
            if (req.user._id !== userId) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Unauthorized: You can only create a profile for your own user ID.');
            }
            const newDriver = yield driver_service_1.DriverService.createDriverProfile(new mongoose_1.Types.ObjectId(userId), vehicleInfo, driverLicenseNumber, phoneNumber, profilePicture);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                success: true,
                message: 'Driver profile created successfully. Awaiting admin approval.',
                data: newDriver,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getDriverProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const driverProfile = yield driver_service_1.DriverService.getDriverProfile(driverUserId, true);
            if (!driverProfile) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found for this user.');
            }
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Driver profile fetched successfully.',
                data: driverProfile,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    updateDriverProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const payload = req.body;
            const updatedDriver = yield driver_service_1.DriverService.updateDriverProfile(driverUserId, payload);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Driver profile updated successfully.',
                data: updatedDriver,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    adminUpdateDriverProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const driverProfileId = new mongoose_1.Types.ObjectId(req.params.id);
            const payload = req.body;
            const updatedDriver = yield driver_service_1.DriverService.adminUpdateDriverProfile(driverProfileId, payload);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'Driver profile updated by admin successfully.',
                data: updatedDriver,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    setAvailabilityStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const driverUserId = new mongoose_1.Types.ObjectId(req.user._id);
            const { status, currentLocation } = req.body;
            const updatedDriver = yield driver_service_1.DriverService.setAvailabilityStatus(driverUserId, status, currentLocation);
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: `Driver availability set to '${status}'.`,
                data: updatedDriver,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllDrivers: (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield driver_service_1.DriverService.getAllDrivers();
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: 'All driver profiles fetched successfully.',
                data: result.data,
                meta: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
