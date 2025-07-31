import { Types } from "mongoose";
import { ILocation } from "../driverProfile/driver.interface";


export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_DRIVER_FOUND = "NO_DRIVER_FOUND",
}


export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId; 
  pickupLocation: ILocation; 
  destinationLocation: ILocation; 
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  status: RideStatus;
  fare?: number;
  cancellationReason?: string;
  riderRating?: number; 
  driverRating?: number; 
  createdAt: Date;
  updatedAt: Date;
}