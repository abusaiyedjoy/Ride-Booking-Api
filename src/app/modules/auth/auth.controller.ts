import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import "../../config/passport";
import AppError from "../../errorManage/appError";
import { StatusCodes } from "http-status-codes";
import { createUserTokens } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IUser } from "../user/user.interface";

const crediantialsLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));

    if (!user) return next(new AppError(StatusCodes.BAD_REQUEST, info.message));

    const userTokens = await createUserTokens(user);

    const { password, ...rest } = user.toObject();

    setAuthCookie(res, userTokens);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
      },
    });
  })(req, res, next);
};

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Refresh token not found");
    }
    const userTokens = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, userTokens);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: userTokens,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 0,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 0,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await AuthService.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
)

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const password = req.body.password;

    await AuthService.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password set successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AuthService.forgotPassword(req.body.email);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password reset link sent successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user ;

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user )

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthController = {
  crediantialsLogin,
  getNewAccessToken,
  logOut,
  changePassword,
  resetPassword,
  setPassword,
  forgotPassword,
  googleCallbackController
};
