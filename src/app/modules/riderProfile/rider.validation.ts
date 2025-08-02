
import { z } from "zod";
import { Types } from "mongoose";
import { locationSchema } from "../driverProfile/driver.validation";

export const createRiderProfileZodSchema = z.object({
  body: z.object({
    userId: z.string().refine(val => Types.ObjectId.isValid(val), {
      message: "Invalid User ID format"
    }),
    phone: z.string().optional(), 
    picture: z.string().url({ message: "Invalid URL format for profile picture" }).optional(),
    paymentMethod: z.string().optional(),
    location: locationSchema.optional(), 
  }),
});

export const updateRiderProfileZodSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    picture: z.string().url({ message: "Invalid URL format for profile picture" }).optional(),
    paymentMethod: z.string().optional(),
    location: locationSchema.optional(),
  }).partial(),
});

export const getRiderProfileByIdZodSchema = z.object({
  params: z.object({
    id: z.string().refine(val => Types.ObjectId.isValid(val), {
      message: "Invalid Rider Profile ID format"
    }),
  }),
});
