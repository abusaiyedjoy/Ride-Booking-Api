import { Types } from "mongoose";

export enum RatingType {
    DRIVER_TO_RIDER = "DRIVER_TO_RIDER",
    RIDER_TO_DRIVER = "RIDER_TO_DRIVER"
};

export interface IRating {
  rideId: Types.ObjectId; 
  raterId: Types.ObjectId;
  ratedId: Types.ObjectId;
  rating: number; 
  comment?: string;
  type: RatingType;
  createdAt: Date;
}