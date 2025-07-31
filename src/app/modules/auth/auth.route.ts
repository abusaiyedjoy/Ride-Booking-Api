import { NextFunction, Request, Response, Router } from "express"
import { AuthController } from "./auth.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"
import passport from "passport"
import { envVars } from "../../config/env"

const router = Router()


router.post("/login", AuthController.crediantialsLogin)
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logOut)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthController.setPassword)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)
// Google
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect =  req.query.redirect as string | "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string})(req, res, next);
});
router.get("/google/callback", passport.authenticate("google", {failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is an error`}), AuthController.googleCallbackController)

export const AuthRoutes = router; 