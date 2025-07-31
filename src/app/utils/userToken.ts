import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorManage/appError";
import { IsActive, IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { StatusCodes } from "http-status-codes"


export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)


    return {
        accessToken,
        refreshToken
    }
};


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExists = await User.findOne({email: verifiedRefreshToken.email})

    if(!isUserExists){
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist")
    }
    if (isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE) {
        throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExists.isActive}`)
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken;
}