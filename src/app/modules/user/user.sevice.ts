import AppError from "../../errorManage/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    envVars.BCRYPT_SALT_ROUNDS
  );

  const authProvider: IAuthProvider[] = [
    {
      provider: "credentials",
      providerId: email as string,
    },
  ];

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: authProvider,
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    if (decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password as string,
      envVars.BCRYPT_SALT_ROUNDS
    );
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
};
