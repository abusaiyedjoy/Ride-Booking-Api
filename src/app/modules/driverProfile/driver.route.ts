
import { Router } from 'express';
import { DriverController } from './driver.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import {
  createDriverProfileZodSchema,
  updateDriverProfileZodSchema,
  adminUpdateDriverProfileZodSchema,
  setAvailabilityStatusZodSchema,
  getDriverProfileByIdZodSchema
} from './driver.validation';

const router = Router();
const driverController = DriverController;

router.post(
  '/create-profile',
  checkAuth(Role.DRIVER),
  validateRequest(createDriverProfileZodSchema),
  driverController.createDriverProfile
);

router.get(
  '/me',
  checkAuth(Role.DRIVER),
  driverController.getDriverProfile
);

router.patch(
  '/me',
  checkAuth(Role.DRIVER),
  validateRequest(updateDriverProfileZodSchema),
  driverController.updateDriverProfile
);

router.patch(
  '/availability',
  checkAuth(Role.DRIVER),
  validateRequest(setAvailabilityStatusZodSchema),
  driverController.setAvailabilityStatus
);

router.get(
  '/admin',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  driverController.getAllDrivers
);

router.patch(
  '/admin/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(adminUpdateDriverProfileZodSchema),
  driverController.adminUpdateDriverProfile
);

router.get(
  '/:id',
  checkAuth(),
  validateRequest(getDriverProfileByIdZodSchema),
  driverController.getDriverProfile
);

export const DriverRoutes = router;
