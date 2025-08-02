
import { NextFunction, Request, Response } from 'express';
import { RatingService } from './rating.service';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { RatingType } from './rating.interface';
import { Role } from '../user/user.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & {
      _id: string;
      role: Role;
    };
  }
}

export const RatingController = {
  createRating: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rideId, ratedId, rating, comment, type } = req.body;
      const raterUserId = new Types.ObjectId(req.user!._id);

      const newRating = await RatingService.createRating(
        new Types.ObjectId(rideId),
        raterUserId,
        new Types.ObjectId(ratedId),
        rating,
        comment,
        type as RatingType
      );

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Rating submitted successfully.',
        data: newRating,
      });
    } catch (error) {
      next(error);
    }
  },

  getRatingsByRideId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rideId = new Types.ObjectId(req.params.rideId);
      const ratings = await RatingService.getRatingsByRideId(rideId);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ratings for ride fetched successfully.',
        data: ratings,
      });
    } catch (error) {
      next(error);
    }
  },

  getRatingsGivenByUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.user!._id);
      const ratings = await RatingService.getRatingsGivenByUser(userId);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ratings given by you fetched successfully.',
        data: ratings,
      });
    } catch (error) {
      next(error);
    }
  },

  getRatingsReceivedByUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.user!._id);
      const ratings = await RatingService.getRatingsReceivedByUser(userId);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Ratings received by you fetched successfully.',
        data: ratings,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllRatings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allRatings = await RatingService.getAllRatings();

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All ratings fetched successfully.',
        data: allRatings.data,
        meta: allRatings.meta,
      });
    } catch (error) {
      next(error);
    }
  },
};
