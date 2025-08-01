import { NextFunction, Request, Response } from 'express';
import { RideService } from './ride.service';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorManage/appError';
import { Types } from 'mongoose';
import { Role } from '../user/user.interface';
import { Driver } from '../driverProfile/driver.model';

export const RideController = {
  requestRide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pickupLocation, destinationLocation } = req.body;
      const riderUserId = new Types.ObjectId((req.user as any)._id);

      const newRide = await RideService.requestRide(
        riderUserId,
        pickupLocation,
        destinationLocation
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Ride requested successfully. Waiting for a driver to accept.',
        data: newRide,
      });
    } catch (error: any) {
      next(error);
    }
  },

  acceptRide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.id);
      const driverUserId = new Types.ObjectId((req.user as any)._id);

      const acceptedRide = await RideService.acceptRide(rideId, driverUserId);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ride accepted successfully.',
        data: acceptedRide,
      });
    } catch (error: any) {
      next(error);
    }
  },

  updateRideStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.id);
      const driverUserId = new Types.ObjectId((req.user as any)._id);
      const { status } = req.body;

      const updatedRide = await RideService.updateRideStatus(rideId, driverUserId, status);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Ride status updated to '${status}'.`,
        data: updatedRide,
      });
    } catch (error: any) {
      next(error);
    }
  },

  cancelRide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.id);
      const riderUserId = new Types.ObjectId((req.user as any)._id);
      const { reason } = req.body;

      const cancelledRide = await RideService.cancelRide(rideId, riderUserId, reason);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ride cancelled successfully.',
        data: cancelledRide,
      });
    } catch (error: any) {
      next(error);
    }
  },

  adminUpdateRideStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.id);
      const adminUserId = new Types.ObjectId((req.user as any)._id);
      const { status } = req.body;

      const updatedRide = await RideService.adminUpdateRideStatus(rideId, status, adminUserId);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Ride status updated to '${status}' by admin.`,
        data: updatedRide,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getRiderRideHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderUserId = new Types.ObjectId((req.user as any)._id);
      const history = await RideService.getRiderRideHistory(riderUserId);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rider ride history fetched successfully.',
        data: history,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getDriverRideHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const driverUserId = new Types.ObjectId((req.user as any)._id);
      const history = await RideService.getDriverRideHistory(driverUserId);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Driver ride history fetched successfully.',
        data: history,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getAllRides: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allRides = await RideService.getAllRides();
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All rides fetched successfully.',
        data: allRides,
      });
    } catch (error: any) {
      next(error);
    }
  },

  findAvailableDrivers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, maxDistanceKm } = req.query;

      const drivers = await RideService.findAvailableDrivers(
        Number(lat),
        Number(lng),
        maxDistanceKm ? Number(maxDistanceKm) : undefined
      );

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Available drivers fetched successfully.',
        data: drivers,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getRideById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.id);
      const ride = await RideService.getRideById(rideId);

      if (!ride) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Ride not found.');
      }

      const userRole = (req.user as any).role;
      const userId = new Types.ObjectId((req.user as any)._id);

      if (userRole === Role.RIDER && !ride.riderId.equals(userId)) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized: You can only view your own rides.');
      }

      if (userRole === Role.DRIVER) {
        const driverProfile = await Driver.findOne({ userId });
        if (!driverProfile || !ride.driverId || !ride.driverId.equals(driverProfile._id)) {
          throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized: You can only view your own rides.');
        }
      }

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ride fetched successfully.',
        data: ride,
      });
    } catch (error: any) {
      next(error);
    }
  },
};
