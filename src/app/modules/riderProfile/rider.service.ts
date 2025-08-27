
import { Types } from 'mongoose';
import { Rider } from './rider.model';
import { User } from '../user/user.model';
import { Role } from '../user/user.interface';
import { IRider } from './rider.interface';
import AppError from '../../errorManage/appError';
import { StatusCodes } from 'http-status-codes';
import { ILocation } from '../driverProfile/driver.interface';

export const RiderService = {

  createRiderProfile: async (
    userId: Types.ObjectId,
    phone?: string,
    picture?: string,
    paymentMethod?: string,
    location?: ILocation
  ): Promise<IRider> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }

    if (user.role !== Role.RIDER) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not registered as a rider.');
    }

    if (!user.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active.');
    }

    const existingRiderProfile = await Rider.findOne({ userId });
    if (existingRiderProfile) {
      throw new AppError(StatusCodes.CONFLICT, 'Rider profile already exists for this user.');
    }

    const newRider = new Rider({
      userId,
      phone,
      picture,
      paymentMethod,
      location,
    });

    await newRider.save();
    return newRider;
  },


  getRiderProfile: async (
    id: Types.ObjectId,
    searchByUserId: boolean = true
  ): Promise<IRider | null> => {
    return searchByUserId
      ? Rider.findOne({ userId: id })
      : Rider.findById(id);
  },

  updateRiderProfile: async (
    riderUserId: Types.ObjectId,
    payload: Partial<IRider>
  ): Promise<IRider | null> => {
    const riderProfile = await Rider.findOne({ userId: riderUserId });

    if (!riderProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Rider profile not found.');
    }

    if (payload.userId) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You cannot change your user ID.');
    }

    Object.assign(riderProfile, payload);
    await riderProfile.save();

    return riderProfile;
  },

  getAllRiders: async (): Promise<{ data: IRider[]; meta: { total: number } }> => {
    const riders = await Rider.find().populate('userId', 'email isBlocked');
    const totalRiders = await Rider.countDocuments();

    return {
      data: riders,
      meta: { total: totalRiders },
    };
  },
};
