import { Router } from "express";
import { Role } from "../user/user.interface";
import { createRideZodSchema, updateRideStatusZodSchema } from "./ride.validation";
import { RideController } from "./ride.controller";
import { checkAuth } from './../../middlewares/checkAuth';
import { validateRequest } from './../../middlewares/validateRequest';

const router = Router();

// Create a new ride (rider only)
router.post(
  "/create-ride",
  checkAuth(Role.RIDER),
  validateRequest(createRideZodSchema),
  RideController.createRide
);

// Get all rides (admin only)
router.get(
  "/All-rides",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  RideController.getAllRides
);
// Cancel a ride (rider only)
router.patch(
  "/cancel/:id",
  checkAuth(Role.RIDER),
  RideController.cancelRide
);

// Update ride status (driver only)
router.patch(
  "/status/:id",
  checkAuth(Role.DRIVER),
  validateRequest(updateRideStatusZodSchema),
  RideController.updateRideStatus
);

// Get ride by ID (rider, driver, or admin)
router.get(
  "/:id",
  checkAuth(Role.RIDER, Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN),
  RideController.getRideById
);

// Get rider's ride history (rider only)
router.get(
  "/me/history",
  checkAuth(Role.RIDER),
  RideController.getRiderRideHistory
);



export const ridesRoutes = router;