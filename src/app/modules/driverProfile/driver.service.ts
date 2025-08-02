import { Types } from 'mongoose';
import { Driver } from './driver.model';
import { User } from '../user/user.model';
import { Role } from '../user/user.interface';
import { IAvailability, IDriver, ILocation, IVehicleInfo } from './driver.interface';
import AppError from '../../errorManage/appError';
import { StatusCodes } from 'http-status-codes';

export const DriverService = {
  /**
   * Create a new driver profile.
   */
  createDriverProfile: async (
    userId: Types.ObjectId,
    vehicleInfo: IVehicleInfo,
    driverLicenseNumber: string,
    phoneNumber?: string,
    profilePicture?: string
  ): Promise<IDriver> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }
    if (user.role !== Role.DRIVER) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not registered as a driver.');
    }
    if (!user.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active.');
    }

    const existingDriverProfile = await Driver.findOne({ userId });
    if (existingDriverProfile) {
      throw new AppError(StatusCodes.CONFLICT, 'Driver profile already exists for this user.');
    }

    const existingVehicle = await Driver.findOne({ 'vehicleInfo.licensePlate': vehicleInfo.licensePlate });
    if (existingVehicle) {
      throw new AppError(StatusCodes.CONFLICT, 'Vehicle with this license plate already registered.');
    }

    const existingDriverLicense = await Driver.findOne({ driverLicenseNumber });
    if (existingDriverLicense) {
      throw new AppError(StatusCodes.CONFLICT, 'Driver with this license number already registered.');
    }

    const newDriver = new Driver({
      userId,
      vehicleInfo,
      driverLicenseNumber,
      phoneNumber,
      profilePicture,
      isApproved: false,
      isSuspended: false,
      availability: IAvailability.OFFLINE,
      totalEarnings: 0,
      averageRating: 5.0,
    });

    await newDriver.save();
    return newDriver;
  },

  /**
   * Get a single driver profile by their User ID or Driver Profile ID.
   */
  getDriverProfile: async (id: Types.ObjectId, byUserId: boolean = true): Promise<IDriver | null> => {
    return byUserId ? Driver.findOne({ userId: id }) : Driver.findById(id);
  },

  /**
   * Driver updates their own profile.
   */
  updateDriverProfile: async (
    driverId: Types.ObjectId,
    payload: Partial<IDriver>
  ): Promise<IDriver | null> => {
    const driverProfile = await Driver.findOne({ userId: driverId });
    if (!driverProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Driver profile not found.');
    }

    const disallowedFields: (keyof IDriver)[] = [
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
        throw new AppError(StatusCodes.FORBIDDEN, `You cannot update '${field}' directly.`);
      }
    }

    if (payload.vehicleInfo) {
      if (
        payload.vehicleInfo.licensePlate &&
        payload.vehicleInfo.licensePlate !== driverProfile.vehicleInfo.licensePlate
      ) {
        const existingVehicle = await Driver.findOne({ 'vehicleInfo.licensePlate': payload.vehicleInfo.licensePlate });
        if (existingVehicle && !existingVehicle._id.equals(driverProfile._id)) {
          throw new AppError(StatusCodes.CONFLICT, 'Vehicle with this license plate already registered to another driver.');
        }
      }
      driverProfile.vehicleInfo = {
        ...driverProfile.vehicleInfo,
        ...payload.vehicleInfo,
      };
      delete payload.vehicleInfo;
    }

    if (
      payload.driverLicenseNumber &&
      payload.driverLicenseNumber !== driverProfile.driverLicenseNumber
    ) {
      const existingDriverLicense = await Driver.findOne({ driverLicenseNumber: payload.driverLicenseNumber });
      if (existingDriverLicense && !existingDriverLicense._id.equals(driverProfile._id)) {
        throw new AppError(StatusCodes.CONFLICT, 'Driver with this license number already registered.');
      }
    }

    Object.assign(driverProfile, payload);
    await driverProfile.save();
    return driverProfile;
  },

  /**
   * Admin updates a driver profile.
   */
  adminUpdateDriverProfile: async (
    driverProfileId: Types.ObjectId,
    payload: Partial<IDriver>
  ): Promise<IDriver | null> => {
    const driverProfile = await Driver.findById(driverProfileId);
    if (!driverProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Driver profile not found.');
    }

    if (payload.vehicleInfo) {
      if (
        payload.vehicleInfo.licensePlate &&
        payload.vehicleInfo.licensePlate !== driverProfile.vehicleInfo.licensePlate
      ) {
        const existingVehicle = await Driver.findOne({ 'vehicleInfo.licensePlate': payload.vehicleInfo.licensePlate });
        if (existingVehicle && !existingVehicle._id.equals(driverProfile._id)) {
          throw new AppError(StatusCodes.CONFLICT, 'Vehicle with this license plate already registered to another driver.');
        }
      }
      driverProfile.vehicleInfo = {
        ...driverProfile.vehicleInfo,
        ...payload.vehicleInfo,
      };
      delete payload.vehicleInfo;
    }

    if (
      payload.driverLicenseNumber &&
      payload.driverLicenseNumber !== driverProfile.driverLicenseNumber
    ) {
      const existingDriverLicense = await Driver.findOne({ driverLicenseNumber: payload.driverLicenseNumber });
      if (existingDriverLicense && !existingDriverLicense._id.equals(driverProfile._id)) {
        throw new AppError(StatusCodes.CONFLICT, 'Driver with this license number already registered.');
      }
    }

    Object.assign(driverProfile, payload);
    await driverProfile.save();
    return driverProfile;
  },

  /**
   * Driver sets their availability status and location.
   */
  setAvailabilityStatus: async (
    driverUserId: Types.ObjectId,
    status: IAvailability,
    currentLocation?: ILocation
  ): Promise<IDriver | null> => {
    const driverProfile = await Driver.findOne({ userId: driverUserId });
    if (!driverProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Driver profile not found.');
    }

    if (driverProfile.isSuspended) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Your account is suspended. You cannot change availability.');
    }

    if (!driverProfile.isApproved && status === IAvailability.ONLINE) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Your account is not yet approved. You cannot go online.');
    }

    driverProfile.availability = status;
    driverProfile.currentLocation = status === IAvailability.ONLINE ? currentLocation : undefined;

    await driverProfile.save();
    return driverProfile;
  },

  /**
   * Admin fetches all drivers.
   */
  getAllDrivers: async (): Promise<{ data: IDriver[]; meta: { total: number } }> => {
    const drivers = await Driver.find().populate('userId', 'email isBlocked');
    const total = await Driver.countDocuments();

    return {
      data: drivers,
      meta: {
        total,
      },
    };
  },
};
