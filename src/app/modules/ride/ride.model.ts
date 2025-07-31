import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";


const RideSchema = new Schema<IRide>({
    riderId: {type: Schema.Types.ObjectId, ref: "Rider", required: true },
    driverId: {type: Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: {type: String, required: true },
    destinationLocation: {type: String, required: true },
    requestedAt: {type: Date, required: true },
    acceptedAt: {type: Date },
    pickedUpAt: {type: Date },
    inTransitAt: {type: Date },
    completedAt: {type: Date },
    cancelledAt: {type: Date },
    status: {type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED },
    fare: {type: Number },
    cancellationReason: {type: String },
    riderRating: {type: Number },
    driverRating: {type: Number },
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now },
}, {
  timestamps: true,
  versionKey: false
});

export const Ride = model<IRide>("Ride", RideSchema);