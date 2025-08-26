import { Router } from "express";
import { Role } from "../user/user.interface";
import { createDriverZodSchema,  updateDriverZodSchema } from "./driver.validation";
import { DriverController } from "./driver.controller";
import { checkAuth } from './../../middlewares/checkAuth';
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

// Create a new driver (admin only)
router.post(
  '/create-driver',
  validateRequest(createDriverZodSchema),
  DriverController.createDriver
);

// Get all drivers (admin only)
router.get(
  '/all-drivers',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverController.getAllDrivers
);

// Get single driver profile (driver or admin)
router.get(
  '/:id',
  checkAuth(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN),
  DriverController.getDriverById
);


// Update driver approval status (admin only)
router.patch(
  '/:id/approve',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDriverZodSchema),
  DriverController.updateDriverStatus
);

// Update driver availability (driver only)
router.patch(
  '/:id/availability',
  checkAuth(Role.DRIVER),
  DriverController.updateDriverAvailability
);



// Get driver's ride history (driver only)
router.get(
  '/:id/ride-history',
  checkAuth(Role.DRIVER),
  DriverController.getDriverRideHistory
);

// Get driver's earnings history (driver only)
router.get(
  '/earnings/:id',
  checkAuth(Role.DRIVER),
  DriverController.getDriverEarnings
);

// Accept a ride request (driver only)
router.patch(
  '/rides/:rideId/accept',
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);

// Update ride status (driver only)
router.patch(
  '/rides/:rideId/status',
  checkAuth(Role.DRIVER),
  DriverController.updateRideStatus
);

export const driversRoutes = router;