import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RiderRoutes } from "./../modules/riderProfile/rider.route";
import { DriverRoutes } from "../modules/driverProfile/driver.route";
import { RideRoutes } from "./../modules/ride/ride.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

export const router = Router();

const allRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/ride",
    route: RideRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  { path: "/driver", route: DriverRoutes },
  { path: "/rider", route: RiderRoutes },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
