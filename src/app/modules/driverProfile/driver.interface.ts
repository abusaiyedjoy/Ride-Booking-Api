import { Types } from "mongoose";

export interface IVehicleInfo {
  type: "BIKE" | "CAR" | string;
  make: string;
  model: string;
  color: string;
  modelYear: number;
  licensePlate: string;
}

export interface ILocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export enum IAvailability {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface IDriver {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  vehicleInfo: IVehicleInfo;
  driverLicenseNumber: string;
  isApproved: boolean;
  isSuspended: boolean;
  availability: IAvailability;
  currentLocation?: ILocation;
  totalEarnings: number;
  averageRating?: number;
  profilePicture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
