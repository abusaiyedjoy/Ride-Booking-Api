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