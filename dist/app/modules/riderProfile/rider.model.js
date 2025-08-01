"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rider = void 0;
const mongoose_1 = require("mongoose");
const riderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String },
    picture: { type: String },
    paymentMethod: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});
exports.Rider = (0, mongoose_1.model)("Rider", riderSchema);
