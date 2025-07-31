import { Types } from "mongoose";
import z from "zod";
import { IAvailability } from "./driver.interface";

const vehicleInfoSchema = z.object({
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1, "Invalid vehicle year"),
  licensePlate: z.string().min(1, "License plate is required").max(20, "License plate too long"),
  color: z.string().min(1, "Vehicle color is required"),
  type: z.enum(['BIKE', 'CAR']).default('BIKE'),
});

export const locationSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.array(z.number()).length(2, "Coordinates must be an array of [longitude, latitude]"),
  address: z.string().min(1, "Address cannot be empty").optional(),
});

export const driverProfileSchema = z.object({
  userId: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid User ID format").optional(),
  vehicleInfo: vehicleInfoSchema,
  driverLicenseNumber: z.string().min(1, "Driver license number is required").max(50, "Driver license number too long"),
  isApproved: z.boolean().default(false).optional(),
  isSuspended: z.boolean().default(false).optional(),
  availabilityStatus: z.enum(Object.values(IAvailability)).default(IAvailability.OFFLINE).optional(),
  currentLocation: locationSchema.optional(),
  totalEarnings: z.number().min(0).default(0).optional(),
  averageRating: z.number().min(1).max(5).default(5).optional(),
  profilePicture: z.string().url("Invalid URL format for profile picture").optional(),
  phoneNumber: z.string().optional(),
});

