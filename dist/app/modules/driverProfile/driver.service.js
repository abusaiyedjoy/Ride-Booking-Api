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
exports.DriverService = void 0;
const driver_model_1 = require("./driver.model");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const driver_interface_1 = require("./driver.interface");
const appError_1 = __importDefault(require("../../errorManage/appError"));
const http_status_codes_1 = require("http-status-codes");
exports.DriverService = {
    /**
     * Create a new driver profile.
     */
    createDriverProfile: (userId, vehicleInfo, driverLicenseNumber, phoneNumber, profilePicture) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found.');
        }
        if (user.role !== user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not registered as a driver.');
        }
        if (!user.isActive) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not active.');
        }
        const existingDriverProfile = yield driver_model_1.Driver.findOne({ userId });
        if (existingDriverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Driver profile already exists for this user.');
        }
        const existingVehicle = yield driver_model_1.Driver.findOne({ 'vehicleInfo.licensePlate': vehicleInfo.licensePlate });
        if (existingVehicle) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Vehicle with this license plate already registered.');
        }
        const existingDriverLicense = yield driver_model_1.Driver.findOne({ driverLicenseNumber });
        if (existingDriverLicense) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Driver with this license number already registered.');
        }
        const newDriver = new driver_model_1.Driver({
            userId,
            vehicleInfo,
            driverLicenseNumber,
            phoneNumber,
            profilePicture,
            isApproved: false,
            isSuspended: false,
            availability: driver_interface_1.IAvailability.OFFLINE,
            totalEarnings: 0,
            averageRating: 5.0,
        });
        yield newDriver.save();
        return newDriver;
    }),
    /**
     * Get a single driver profile by their User ID or Driver Profile ID.
     */
    getDriverProfile: (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, byUserId = true) {
        return byUserId ? driver_model_1.Driver.findOne({ userId: id }) : driver_model_1.Driver.findById(id);
    }),
    /**
     * Driver updates their own profile.
     */
    updateDriverProfile: (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const driverProfile = yield driver_model_1.Driver.findOne({ userId: driverId });
        if (!driverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found.');
        }
        const disallowedFields = [
            'isApproved',
            'isSuspended',
            'availability',
            'totalEarnings',
            'averageRating',
            'userId',
            '_id',
        ];
        for (const field of disallowedFields) {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `You cannot update '${field}' directly.`);
            }
        }
        if (payload.vehicleInfo) {
            if (payload.vehicleInfo.licensePlate &&
                payload.vehicleInfo.licensePlate !== driverProfile.vehicleInfo.licensePlate) {
                const existingVehicle = yield driver_model_1.Driver.findOne({ 'vehicleInfo.licensePlate': payload.vehicleInfo.licensePlate });
                if (existingVehicle && !existingVehicle._id.equals(driverProfile._id)) {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Vehicle with this license plate already registered to another driver.');
                }
            }
            driverProfile.vehicleInfo = Object.assign(Object.assign({}, driverProfile.vehicleInfo), payload.vehicleInfo);
            delete payload.vehicleInfo;
        }
        if (payload.driverLicenseNumber &&
            payload.driverLicenseNumber !== driverProfile.driverLicenseNumber) {
            const existingDriverLicense = yield driver_model_1.Driver.findOne({ driverLicenseNumber: payload.driverLicenseNumber });
            if (existingDriverLicense && !existingDriverLicense._id.equals(driverProfile._id)) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Driver with this license number already registered.');
            }
        }
        Object.assign(driverProfile, payload);
        yield driverProfile.save();
        return driverProfile;
    }),
    /**
     * Admin updates a driver profile.
     */
    adminUpdateDriverProfile: (driverProfileId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const driverProfile = yield driver_model_1.Driver.findById(driverProfileId);
        if (!driverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found.');
        }
        if (payload.vehicleInfo) {
            if (payload.vehicleInfo.licensePlate &&
                payload.vehicleInfo.licensePlate !== driverProfile.vehicleInfo.licensePlate) {
                const existingVehicle = yield driver_model_1.Driver.findOne({ 'vehicleInfo.licensePlate': payload.vehicleInfo.licensePlate });
                if (existingVehicle && !existingVehicle._id.equals(driverProfile._id)) {
                    throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Vehicle with this license plate already registered to another driver.');
                }
            }
            driverProfile.vehicleInfo = Object.assign(Object.assign({}, driverProfile.vehicleInfo), payload.vehicleInfo);
            delete payload.vehicleInfo;
        }
        if (payload.driverLicenseNumber &&
            payload.driverLicenseNumber !== driverProfile.driverLicenseNumber) {
            const existingDriverLicense = yield driver_model_1.Driver.findOne({ driverLicenseNumber: payload.driverLicenseNumber });
            if (existingDriverLicense && !existingDriverLicense._id.equals(driverProfile._id)) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Driver with this license number already registered.');
            }
        }
        Object.assign(driverProfile, payload);
        yield driverProfile.save();
        return driverProfile;
    }),
    /**
     * Driver sets their availability status and location.
     */
    setAvailabilityStatus: (driverUserId, status, currentLocation) => __awaiter(void 0, void 0, void 0, function* () {
        const driverProfile = yield driver_model_1.Driver.findOne({ userId: driverUserId });
        if (!driverProfile) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found.');
        }
        if (driverProfile.isSuspended) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is suspended. You cannot change availability.');
        }
        if (!driverProfile.isApproved && status === driver_interface_1.IAvailability.ONLINE) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is not yet approved. You cannot go online.');
        }
        driverProfile.availability = status;
        driverProfile.currentLocation = status === driver_interface_1.IAvailability.ONLINE ? currentLocation : undefined;
        yield driverProfile.save();
        return driverProfile;
    }),
    /**
     * Admin fetches all drivers.
     */
    getAllDrivers: () => __awaiter(void 0, void 0, void 0, function* () {
        const drivers = yield driver_model_1.Driver.find().populate('userId', 'email isBlocked');
        const total = yield driver_model_1.Driver.countDocuments();
        return {
            data: drivers,
            meta: {
                total,
            },
        };
    }),
};
