import { Router } from 'express';
import { RideController } from './ride.controller';
import { validateRequest } from '../../middlewares/validateRequest'; 
import {
  requestRideZodSchema,
  updateRideStatusZodSchema,
  cancelRideZodSchema,
  adminUpdateRideStatusZodSchema,
  acceptRideZodSchema,
  findAvailableDriversZodSchema
} from './ride.validation'; 
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

const rideController = RideController;

router.get(
  '/drivers/available',
  validateRequest(findAvailableDriversZodSchema),
  rideController.findAvailableDrivers
);

// Rider-specific routes
router.post(
  '/request',
  checkAuth(Role.RIDER),
  validateRequest(requestRideZodSchema),
  rideController.requestRide
);
router.patch(
  '/:id/cancel',
  checkAuth(Role.RIDER),
  validateRequest(cancelRideZodSchema),
  rideController.cancelRide
);
router.get(
  '/history/me',
  checkAuth(Role.RIDER),
  rideController.getRiderRideHistory
);

// Driver-specific routes
router.patch(
  '/:id/accept',
  checkAuth(Role.DRIVER),
  validateRequest(acceptRideZodSchema),
  rideController.acceptRide
);
router.patch(
  '/:id/status',
  checkAuth(Role.DRIVER),
  validateRequest(updateRideStatusZodSchema),
  rideController.updateRideStatus
);
router.get(
  '/history/driver',
  checkAuth(Role.DRIVER),
  rideController.getDriverRideHistory
);

// Admin-specific routes
router.patch(
  '/admin/:id/status',
  checkAuth(Role.ADMIN),
  validateRequest(adminUpdateRideStatusZodSchema),
  rideController.adminUpdateRideStatus
);
router.get(
  '/admin',
  checkAuth(Role.ADMIN),
  rideController.getAllRides
);

// Shared route: Allow all authenticated roles to attempt to view
router.get(
  '/:id',
  checkAuth(Role.ADMIN, Role.DRIVER, Role.RIDER),
  rideController.getRideById
);

export const RideRoutes = router;
