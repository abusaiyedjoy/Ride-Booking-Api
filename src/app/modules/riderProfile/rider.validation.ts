import { Types } from "mongoose";
import z from "zod";


export const riderProfileSchema = z.object({
  userId: z.string().refine(val => Types.ObjectId.isValid(val), "Invalid User ID format").optional(), 
  paymentMethod: z.string().optional(),
  locations: z.string().optional(),
  picture: z.string().url("Invalid URL format for profile picture").optional(),
  phone: z.string().optional(), 
});