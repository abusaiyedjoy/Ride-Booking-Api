
import { NextFunction, Request, Response } from 'express';
import { DriverService } from './driver.service';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import AppError from '../../errorManage/appError';
import { IAvailability } from './driver.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & {
      userId: string;
      role: string;
    };
  }
}

export const DriverController = {
  createDriverProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, vehicleInfo, driverLicenseNumber, phoneNumber, profilePicture } = req.body;

      if (req.user!.userId !== userId) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized: You can only create a profile for your own user ID.');
      }

      const newDriver = await DriverService.createDriverProfile(
        new Types.ObjectId(userId),
        vehicleInfo,
        driverLicenseNumber,
        phoneNumber,
        profilePicture
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Driver profile created successfully. Awaiting admin approval.',
        data: newDriver,
      });
    } catch (error) {
      next(error);
    }
  },

  getDriverProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverUserId = new Types.ObjectId(req.user!.userId);
      const driverProfile = await DriverService.getDriverProfile(driverUserId, true);

      if (!driverProfile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Driver profile not found for this user.');
      }

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Driver profile fetched successfully.',
        data: driverProfile,
      });
    } catch (error) {
      next(error);
    }
  },
  updateDriverProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverUserId = new Types.ObjectId(req.user!.userId);
      const payload = req.body;

      const updatedDriver = await DriverService.updateDriverProfile(driverUserId, payload);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Driver profile updated successfully.',
        data: updatedDriver,
      });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateDriverProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverProfileId = new Types.ObjectId(req.params.id);
      const payload = req.body;

      const updatedDriver = await DriverService.adminUpdateDriverProfile(driverProfileId, payload);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Driver profile updated by admin successfully.',
        data: updatedDriver,
      });
    } catch (error) {
      next(error);
    }
  },

  setAvailabilityStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverUserId = new Types.ObjectId(req.user!.userId);
      const { status, currentLocation } = req.body;

      const updatedDriver = await DriverService.setAvailabilityStatus(
        driverUserId,
        status as IAvailability,
        currentLocation
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Driver availability set to '${status}'.`,
        data: updatedDriver,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllDrivers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DriverService.getAllDrivers();

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All driver profiles fetched successfully.',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};
