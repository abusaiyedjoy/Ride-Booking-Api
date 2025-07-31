import { IRating, RatingType } from "./rating.interface";
import { model, Schema } from 'mongoose';



const ratingSchema = new Schema<IRating>({
    rideId: {type: Schema.Types.ObjectId, ref: "Ride", required: true },
    raterId: {type: Schema.Types.ObjectId, ref: "User", required: true },
    ratedId: {type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: {type: Number, required: true },
    comment: {type: String },
    type: {type: String, enum: Object.values(RatingType), required: true },
    createdAt: {type: Date, default: Date.now },
},{
    timestamps: true,
    versionKey: false
});

export const Rating = model<IRating>("Rating", ratingSchema);