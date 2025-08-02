
import { NextFunction, Request, Response } from 'express';
import { RiderService } from './rider.service';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import AppError from '../../errorManage/appError';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & {
      _id: string;
      role: string;
    };
  }
};

export const RiderController = {
  createRiderProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, phone, picture, paymentMethod, location } = req.body;

      if (!req.user || req.user._id !== userId) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized: You can only create a profile for your own account.');
      }

      const newRider = await RiderService.createRiderProfile(
        new Types.ObjectId(userId),
        phone,
        picture,
        paymentMethod,
        location
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Rider profile created successfully.',
        data: newRider,
      });
    } catch (error) {
      next(error);
    }
  },

  getOwnRiderProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderUserId = new Types.ObjectId(req.user!._id);
      const riderProfile = await RiderService.getRiderProfile(riderUserId, true);

      if (!riderProfile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Rider profile not found.');
      }

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rider profile fetched successfully.',
        data: riderProfile,
      });
    } catch (error) {
      next(error);
    }
  },
  updateRiderProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderUserId = new Types.ObjectId(req.user!._id);
      const updatedRider = await RiderService.updateRiderProfile(riderUserId, req.body);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rider profile updated successfully.',
        data: updatedRider,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllRiders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riders = await RiderService.getAllRiders();
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All rider profiles fetched successfully.',
        data: riders.data,
        meta: riders.meta,
      });
    } catch (error) {
      next(error);
    }
  },

  getSingleRiderProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const riderProfileId = new Types.ObjectId(req.params.id);
      const riderProfile = await RiderService.getRiderProfile(riderProfileId, false);

      if (!riderProfile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Rider profile not found.');
      }

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rider profile fetched successfully.',
        data: riderProfile,
      });
    } catch (error) {
      next(error);
    }
  },
};
