import { IAvailability, IDriver, ILocation, IVehicleInfo } from "./driver.interface";
import { model, Schema } from 'mongoose';


const vehicleInfoSchema = new Schema<IVehicleInfo>({
    type: {type: String, required: true },
    make: {type: String, required: true },
    model: {type: String, required: true },
    color: {type: String, required: true },
    modelYear: {type: Number, required: true },
    licensePlate: {type: String, required: true },
},{
    _id: false,
    versionKey: false
});

const locationSchema = new Schema<ILocation>({
    type: {type: String, required: true },
    coordinates: {type: [Number, Number], required: true },
    address: {type: String },
},{
    _id: false,
    versionKey: false
});


const driverSchema = new Schema<IDriver>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    vehicleInfo: {type: vehicleInfoSchema, required: true },
    driverLicenseNumber: {type: String , required: true },
    isApproved: {type: Boolean, default: false },
    isSuspended: {type: Boolean, default: false },
    availability: {
        type: String,
        enum: Object.values(IAvailability),
        default: IAvailability.OFFLINE
     },
    currentLocation: {type: locationSchema},
    totalEarnings: {type: Number, default: 0 },
    averageRating: {type: Number, default: 5 },
    profilePicture: {type: String },
    phoneNumber: {type: String },
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now },
},{
    timestamps: true,
    versionKey: false
});

export const Driver = model<IDriver>("Driver", driverSchema);