import z from "zod";
import { Types } from "mongoose";
import { locationSchema } from "../driverProfile/driver.validation";
import { RideStatus } from "./ride.interface";



export const rideZodSchema = z.object({
  riderId: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Rider ID format"),
  driverId: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Driver ID format").optional(), 
  pickupLocation: locationSchema,
  destinationLocation: locationSchema,
  acceptedAt: z.string().datetime().optional(),
  pickedUpAt: z.string().datetime().optional(),
  inTransitAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  status: z.enum(Object.values(RideStatus) as [string]).default(RideStatus.REQUESTED),
  fare: z.number().min(0).optional(),
  cancellationReason: z.string().min(1, "Cancellation reason cannot be empty").optional(),
  riderRating: z.number().min(1).max(5).optional(),
  driverRating: z.number().min(1).max(5).optional(),
});

export const requestRideZodSchema = z.object({
  body: z.object({
    pickupLocation: locationSchema,
    destinationLocation: locationSchema,
  }),
});

export const acceptRideZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Ride ID format"),
  }),
  body: z.object({}).strict().optional(),
});

export const updateRideStatusZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Ride ID format"),
  }),
  body: z.object({
    status: z.enum(Object.values(RideStatus) as [string]),
  })
});

export const cancelRideZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Ride ID format"),
  }),
  body: z.object({
    reason: z.string().min(1, "Cancellation reason cannot be empty").optional(),
  }),
});

export const adminUpdateRideStatusZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Ride ID format"),
  }),
  body: z.object({
    status: z.enum(Object.values(RideStatus) as [string]), 
  }),
});

export const findAvailableDriversZodSchema = z.object({
  query: z.object({
    lat: z.string().transform(Number).refine(val =>!isNaN(val) && val >= -90 && val <= 90, "Invalid latitude. Must be a number between -90 and 90."),
    lng: z.string().transform(Number).refine(val =>!isNaN(val) && val >= -180 && val <= 180, "Invalid longitude. Must be a number between -180 and 180."),
    maxDistanceKm: z.string().transform(Number).refine(val =>!isNaN(val) && val > 0, "Invalid maxDistanceKm. Must be a positive number.").optional(),
  }),
});

export const getRideByIdZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid Ride ID format"),
  }),
});