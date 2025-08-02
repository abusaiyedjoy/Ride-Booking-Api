
import { z } from "zod";
import { Types } from "mongoose";
import { RatingType } from "./rating.interface";

export const createRatingZodSchema = z.object({
  body: z.object({
    rideId: z.string().refine(
      val => Types.ObjectId.isValid(val),
      { message: "Invalid Ride ID format" }
    ),
    ratedId: z.string().refine(
      val => Types.ObjectId.isValid(val),
      { message: "Invalid Rated User ID format" }
    ),
    rating: z.number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
      .int({ message: "Rating must be an integer" })
      .min(1, { message: "Rating must be at least 1" })
      .max(5, { message: "Rating must be at most 5" }),

    comment: z.string().max(500, { message: "Comment cannot exceed 500 characters" }).optional(),

    type: z.enum(Object.values(RatingType) as [string, ...string], {
      required_error: "Rating type is required",
      invalid_type_error: "Invalid rating type",
    }),
  }),
});

export const getRatingsByRideIdZodSchema = z.object({
  params: z.object({
    rideId: z.string().refine(
      val => Types.ObjectId.isValid(val),
      { message: "Invalid Ride ID format" }
    ),
  }),
});
