import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id: Types.ObjectId;
    name?: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isActive?: IsActive;
    role: Role;
    createdAt?: Date;
    updatedAt?: Date;
};