import { IRider } from "./rider.interface";
import { model, Schema } from "mongoose";

const riderSchema = new Schema<IRider>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String },
    picture: { type: String },
    paymentMethod: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"], 
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
      address: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Rider = model<IRider>("Rider", riderSchema);
