import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.sevice";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
};

export const UserController = { createUser };