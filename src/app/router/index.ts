import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { RideRoutes } from "../modules/ride/ride.route"
import { RiderRoutes } from "../modules/riderProfile/rider.route"
import { DriverRoutes } from "../modules/driverProfile/driver.route"


export const router = Router()

const allRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/ride",
        route: RideRoutes
    },
    {
        path: "/rider",
        route: RiderRoutes
    },
    {
        path: "/driver",
        route: DriverRoutes
    },
]

allRoutes.forEach(route => {
    router.use(route.path, route.route)
})