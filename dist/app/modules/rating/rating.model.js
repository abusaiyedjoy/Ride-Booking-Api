"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const rating_interface_1 = require("./rating.interface");
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    rideId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", required: true },
    raterId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    ratedId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    type: { type: String, enum: Object.values(rating_interface_1.RatingType), required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});
exports.Rating = (0, mongoose_1.model)("Rating", ratingSchema);
