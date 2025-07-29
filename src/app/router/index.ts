import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"


export const router = Router()

const allRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
]

allRoutes.forEach(route => {
    router.use(route.path, route.route)
})