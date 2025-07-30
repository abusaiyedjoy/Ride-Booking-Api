import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.sevice";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) =>{
  const users = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const payload = req.body;
  const decodedToken = req.user;

  const user = await UserService.updateUser(userId, payload, decodedToken as JwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

export const UserController = { 
  createUser,
  getAllUsers,
  updateUser
 };