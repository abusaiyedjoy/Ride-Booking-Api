import { z } from "zod";
import { Types } from "mongoose";
import { IAvailability } from "./driver.interface";

const availabilityOptions = Object.values(IAvailability) as [
  string,
  ...string[]
];

export const locationSchema = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z
    .array(z.number())
    .length(2, "Coordinates must be an array of [longitude, latitude]"),
  address: z.string().min(1, "Address cannot be empty").optional(),
});

export const vehicleInfoZodSchema = z.object({
  type: z.string().min(1, "Vehicle type is required"),
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  color: z.string().min(1, "Vehicle color is required"),
  modelYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1, "Invalid vehicle model year"),
  licensePlate: z
    .string()
    .min(1, "License plate is required")
    .max(20, "License plate too long"),
});

export const createDriverProfileZodSchema = z.object({
  userId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), "Invalid User ID format"),
  vehicleInfo: vehicleInfoZodSchema,
  driverLicenseNumber: z
    .string()
    .min(1, "Driver license number is required")
    .max(50, "Driver license number too long"),
  phoneNumber: z.string().optional(),
  profilePicture: z
    .string()
    .url("Invalid URL format for profile picture")
    .optional(),
});

export const updateDriverProfileZodSchema = z.object({
  vehicleInfo: vehicleInfoZodSchema.partial().optional(),
  driverLicenseNumber: z
    .string()
    .min(1, "Driver license number cannot be empty")
    .max(50)
    .optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z
    .string()
    .url("Invalid URL format for profile picture")
    .optional(),
});

export const adminUpdateDriverProfileZodSchema = z.object({
  id: z
    .string()
    .refine(
      (val) => Types.ObjectId.isValid(val),
      "Invalid Driver Profile ID format"
    ),
  isApproved: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  availability: z.enum(Object.values(availabilityOptions)).optional(),
  totalEarnings: z.number().min(0).optional(),
  averageRating: z.number().min(1).max(5).optional(),
});

export const setAvailabilityStatusZodSchema = z
  .object({
    status: z.enum(Object.values(availabilityOptions)),
    currentLocation: locationSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.status === IAvailability.ONLINE && !data.currentLocation) {
        return false;
      }
      return true;
    },
    {
      message:
        "currentLocation is required when setting availability to 'Online'",
      path: ["currentLocation"],
    }
  );

export const getDriverProfileByIdZodSchema = z.object({
  id: z
    .string()
    .refine(
      (val) => Types.ObjectId.isValid(val),
      "Invalid Driver Profile ID format"
    ),
});
