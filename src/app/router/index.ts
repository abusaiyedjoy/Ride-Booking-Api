import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { driversRoutes } from './../modules/driver/driver.routes';
import { riderRoutes } from './../modules/Rider/rider.routes';
import { ridesRoutes } from './../modules/ride/ride.routes';

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
    path: "/rides",
    route: ridesRoutes,
  },
  { path: "/driver", route: driversRoutes },
  { path: "/rider", route: riderRoutes },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
