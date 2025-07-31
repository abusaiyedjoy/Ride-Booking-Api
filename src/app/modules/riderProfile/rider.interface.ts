import { Types } from "mongoose";



export interface IRider {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    phone?: string;
    picture?: string;
    paymentMethod?: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}