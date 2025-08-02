import { Types } from 'mongoose';
import { Rating } from './rating.model';
import { Ride } from '../ride/ride.model';
import { User } from '../user/user.model';
import { IRating, RatingType } from './rating.interface';
import AppError from '../../errorManage/appError';
import { StatusCodes } from 'http-status-codes';
import { Driver } from '../driverProfile/driver.model';
import { Rider } from '../riderProfile/rider.model';

export const RatingService = {
  createRating: async (
    rideId: Types.ObjectId,
    raterUserId: Types.ObjectId,
    ratedUserId: Types.ObjectId,
    ratingValue: number,
    comment?: string,
    type: RatingType
  ): Promise<IRating> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Ride not found.');
    }
    if (ride.status !== 'COMPLETED') {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Rating can only be given for completed rides.');
    }

    const raterUser = await User.findById(raterUserId);
    const ratedUser = await User.findById(ratedUserId);
    if (!raterUser || !ratedUser) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Rater or Rated user not found.');
    }
    if (raterUser.isActive || ratedUser.isActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Cannot create rating: Rater or Rated user account is inactive.');
    }

    const isRaterRider = ride.riderId.equals(raterUserId);
    const isRaterDriver = ride.driverId?.equals(raterUserId);
    const isRatedRider = ride.riderId.equals(ratedUserId);
    const isRatedDriver = ride.driverId?.equals(ratedUserId);

    if (!(isRaterRider || isRaterDriver)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Rater is not a participant of this ride.');
    }
    if (!(isRatedRider || isRatedDriver)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Rated user is not a participant of this ride.');
    }
    if (raterUserId.equals(ratedUserId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Cannot rate yourself.');
    }

    if (type === RatingType.RIDER_TO_DRIVER) {
      if (!isRaterRider || !isRatedDriver) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid rating type: Rider must rate Driver.');
      }
    } else if (type === RatingType.DRIVER_TO_RIDER) {
      if (!isRaterDriver || !isRatedRider) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid rating type: Driver must rate Rider.');
      }
    }

    const existingRating = await Rating.findOne({
      rideId,
      raterId: raterUserId,
      type,
    });
    if (existingRating) {
      throw new AppError(StatusCodes.CONFLICT, 'You have already submitted a rating for this ride.');
    }

    const newRating = new Rating({
      rideId,
      raterId: raterUserId,
      ratedId: ratedUserId,
      rating: ratingValue,
      comment,
      type,
    });

    await newRating.save();

    // Update average rating
    if (type === RatingType.RIDER_TO_DRIVER) {
      const driverProfile = await Driver.findOne({ userId: ratedUserId });
      if (driverProfile) {
        const driverRatings = await Rating.find({ ratedId: ratedUserId, type: RatingType.RIDER_TO_DRIVER });
        if (driverRatings.length > 0) {
          const totalRating = driverRatings.reduce((sum, r) => sum + r.rating, 0);
          driverProfile.averageRating = totalRating / driverRatings.length;
          await driverProfile.save();
        }
      }
    } else if (type === RatingType.DRIVER_TO_RIDER) {
      const riderProfile = await Rider.findOne({ userId: ratedUserId });
      if (riderProfile) {
        const riderRatings = await Rating.find({ ratedId: ratedUserId, type: RatingType.DRIVER_TO_RIDER });
        if (riderRatings.length > 0) {
          const totalRating = riderRatings.reduce((sum, r) => sum + r.rating, 0);
          riderProfile.rating = totalRating / riderRatings.length;
          await riderProfile.save();
        }
      }
    }

    return newRating;
  },

  getRatingsByRideId: async (rideId: Types.ObjectId): Promise<IRating[]> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Ride not found.');
    }

    return Rating.find({ rideId })
      .populate('raterId', 'email role')
      .populate('ratedId', 'email role')
      .sort({ createdAt: -1 });
  },

  getRatingsGivenByUser: async (userId: Types.ObjectId): Promise<IRating[]> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }

    return Rating.find({ raterId: userId })
      .populate('rideId', 'pickupLocation destinationLocation status')
      .populate('ratedId', 'email role')
      .sort({ createdAt: -1 });
  },

  getRatingsReceivedByUser: async (userId: Types.ObjectId): Promise<IRating[]> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }

    return Rating.find({ ratedId: userId })
      .populate('rideId', 'pickupLocation destinationLocation status')
      .populate('raterId', 'email role')
      .sort({ createdAt: -1 });
  },

  getAllRatings: async (): Promise<{ data: IRating[]; meta: { total: number } }> => {
    const ratings = await Rating.find()
      .populate('rideId', 'pickupLocation destinationLocation status')
      .populate('raterId', 'email role')
      .populate('ratedId', 'email role')
      .sort({ createdAt: -1 });

    const totalRatings = await Rating.countDocuments();

    return {
      data: ratings,
      meta: {
        total: totalRatings,
      },
    };
  },
};
