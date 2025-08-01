import { Types } from "mongoose";
import { IRide } from "./ride.interface";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorManage/appError";
import { Ride } from "./ride.model";
import { Role } from "../user/user.interface";
import { Driver } from "../driverProfile/driver.model";
import { IDriver } from "../driverProfile/driver.interface";

export const RideService = {
  /**
   * Rider requests a new ride.
   * Enforces: A rider can only have one active ride (requested, accepted, picked_up, in_transit) at a time.
   */
  requestRide: async (
    riderId: Types.ObjectId,
    pickupLocation: {
      type: "Point";
      coordinates: [number, number];
      address?: string;
    },
    destinationLocation: {
      type: "Point";
      coordinates: [number, number];
      address?: string;
    }
  ): Promise<IRide> => {
    const isRiderExist = await User.findById(riderId);
    if (!isRiderExist) {
      throw new AppError(StatusCodes.NOT_FOUND, "Rider not found.");
    }
    const riderUserId = isRiderExist._id;

    const activeRide = await Ride.findOne({
      riderId: riderUserId,
      status: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });

    if (activeRide) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You already have an active ride. Please complete or cancel it first."
      );
    }

    const newRide = new Ride({
      riderId: riderUserId,
      pickupLocation,
      destinationLocation,
      status: "REQUESTED",
      requestedAt: new Date(),
    });

    await newRide.save();
    return newRide;
  },

  acceptRide: async (
    rideId: Types.ObjectId,
    driverId: Types.ObjectId
  ): Promise<IRide> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, "Ride request not found.");
    }
    if (ride.status !== "REQUESTED") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'This ride cannot be accepted. It is no longer in "requested" status.'
      );
    }
    if (ride.driverId) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "This ride has already been accepted by another driver."
      );
    }

    const driverUser = await User.findById(driverId);

    if (!driverUser || driverUser.role !== Role.DRIVER) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Driver not found or account is blocked/not a driver."
      );
    }

    const driverProfile = await Driver.findOne({ userId: driverId });
    if (!driverProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, "Driver profile not found.");
    }
    if (!driverProfile.isApproved) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Driver is not approved to accept rides."
      );
    }
    if (driverProfile.isSuspended) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Driver account is suspended and cannot accept rides."
      );
    }
    if (driverProfile.availability !== "ONLINE") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Driver is not online and cannot accept rides."
      );
    }

    const activeDriverRide = await Ride.findOne({
      driverId: driverProfile._id,
      status: { $in: ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });
    if (activeDriverRide) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Driver is already on an active ride."
      );
    }

    ride.driverId = driverProfile._id;
    ride.status = "ACCEPTED";
    ride.acceptedAt = new Date();
    await ride.save();

    return ride;
  },

  /**
   * Driver updates the status of an accepted ride.
   * Valid transitions: accepted -> picked_up -> in_transit -> completed.
   */
  updateRideStatus: async (
    rideId: Types.ObjectId,
    driverId: Types.ObjectId,
    newStatus: "PICKED_UP" | "IN_TRANSIT" | "COMPLETED"
  ): Promise<IRide> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, "Ride not found.");
    }

    const driverProfile = await Driver.findOne({ userId: driverId });
    if (
      !driverProfile ||
      !ride.driverId ||
      !ride.driverId.equals(driverProfile._id)
    ) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Unauthorized: You are not the driver for this ride."
      );
    }

    const currentStatus = ride.status;

    switch (newStatus) {
      case "PICKED_UP":
        if (currentStatus !== "ACCEPTED") {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Ride must be in "accepted" status to be picked up.'
          );
        }
        ride.pickedUpAt = new Date();
        break;
      case "IN_TRANSIT":
        if (currentStatus !== "PICKED_UP") {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Ride must be in "picked_up" status to be in transit.'
          );
        }
        ride.inTransitAt = new Date();
        break;
      case "COMPLETED":
        if (currentStatus !== "IN_TRANSIT") {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Ride must be in "in_transit" status to be completed.'
          );
        }
        ride.completedAt = new Date();

        driverProfile.totalEarnings += ride.fare || 0;
        await driverProfile.save();
        break;
      default:
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Invalid new status provided."
        );
    }

    ride.status = newStatus;
    await ride.save();
    return ride;
  },

  /**
   * Rider cancels a ride.
   */
  cancelRide: async (
    rideId: Types.ObjectId,
    riderId: Types.ObjectId,
    cancellationReason?: string
  ): Promise<IRide> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, "Ride not found.");
    }

    if (!ride.riderId.equals(riderId)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Unauthorized: You are not the rider for this ride."
      );
    }

    const currentStatus = ride.status;
    const now = new Date();

    const cancellationWindowMinutes = 5;

    if (currentStatus === "REQUESTED") {
      // Always allow cancellation if still requested
    } else if (currentStatus === "ACCEPTED") {
      if (
        !ride.acceptedAt ||
        (now.getTime() - ride.acceptedAt.getTime()) / (1000 * 60) >
          cancellationWindowMinutes
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Cancellation not allowed after ${cancellationWindowMinutes} minutes of acceptance.`
        );
      }
    } else if (
      [
        "PICKED_UP",
        "IN_TRANSIT",
        "COMPLETED",
        "CANCELLED",
        "NO_DRIVER_FOUND",
      ].includes(currentStatus)
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Ride cannot be cancelled in "${currentStatus}" status.`
      );
    }

    ride.status = "CANCELLED";
    ride.cancelledAt = now;
    ride.cancellationReason = cancellationReason || "Rider cancelled";
    await ride.save();

    return ride;
  },

  /**
   * Admin updates any ride status.
   */
  adminUpdateRideStatus: async (
    rideId: Types.ObjectId,
    newStatus:
      | "REQUESTED"
      | "ACCEPTED"
      | "PICKED_UP"
      | "IN_TRANSIT"
      | "COMPLETED"
      | "CANCELLED"
      | "NO_DRIVER_FOUND",
    adminId: Types.ObjectId
  ): Promise<IRide> => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(StatusCodes.NOT_FOUND, "Ride not found.");
    }

    const now = new Date();
    switch (newStatus) {
      case "REQUESTED":
        if (!ride.requestedAt) ride.requestedAt = now;
        break;
      case "ACCEPTED":
        if (!ride.acceptedAt) ride.acceptedAt = now;
        break;
      case "PICKED_UP":
        if (!ride.pickedUpAt) ride.pickedUpAt = now;
        break;
      case "IN_TRANSIT":
        if (!ride.inTransitAt) ride.inTransitAt = now;
        break;
      case "COMPLETED":
        if (!ride.completedAt) ride.completedAt = now;
        break;
      case "CANCELLED":
        if (!ride.cancelledAt) ride.cancelledAt = now;
        break;
      case "NO_DRIVER_FOUND":
        break;
    }

    ride.status = newStatus;
    await ride.save();
    return ride;
  },

  /**
   * Get a rider's ride history.
   */
  getRiderRideHistory: async (riderId: Types.ObjectId): Promise<IRide> => {
    const riderUser = await User.findById(riderId);
    if (!riderUser || riderUser.role !== Role.RIDER) {
      throw new AppError(StatusCodes.NOT_FOUND, "Rider not found.");
    }
    return Ride.find({ riderId: riderId }).sort({ requestedAt: -1 });
  },

  /**
   * Get a driver's ride history (completed and accepted/active rides).
   */
  getDriverRideHistory: async (
    driverId: Types.ObjectId
  ): Promise<IRide> => {
    const driverProfile = await Driver.findOne({ userId: driverId });
    if (!driverProfile) {
      throw new AppError(StatusCodes.NOT_FOUND, "Driver profile not found.");
    }
    return Ride.find({ driverId: driverProfile._id }).sort({ requestedAt: -1 });
  },

  /**
   * Get all rides (Admin only).
   */
  getAllRides: async (): Promise<IRide> => {
    return Ride.find().sort({ requestedAt: -1 });
  },

  /**
   * Find available drivers near a location (for potential auto-matching or driver view).
   */
  findAvailableDrivers: async (
    latitude: number,
    longitude: number,
    maxDistanceKm: number = 10
  ): Promise<IDriver> => {
    return Driver.find({
      isApproved: true,
      isSuspended: false,
      availabilityStatus: "ONLINE",
      currentLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistanceKm * 1000, 
        },
      },
    });
  },

  /**
   * Get a single ride by ID.
   */
  getRideById: async (rideId: Types.ObjectId): Promise<IRide | null> => {
    return Ride.findById(rideId);
  },
};
