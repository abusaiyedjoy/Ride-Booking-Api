
import { Router } from 'express';
import { RiderController } from './rider.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import {
  createRiderProfileZodSchema,
  updateRiderProfileZodSchema,
  getRiderProfileByIdZodSchema,
} from './rider.validation';

const router = Router();
const riderController = RiderController;

router.post(
  '/create-profile',
  checkAuth(Role.RIDER),
  validateRequest(createRiderProfileZodSchema),
  riderController.createRiderProfile
);

router.get(
  '/me',
  checkAuth(Role.RIDER),
  riderController.getOwnRiderProfile
);

router.patch(
  '/me',
  checkAuth(Role.RIDER),
  validateRequest(updateRiderProfileZodSchema),
  riderController.updateRiderProfile
);

router.get(
  '/admin',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  riderController.getAllRiders
);

router.get(
  '/admin/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(getRiderProfileByIdZodSchema),
  riderController.getSingleRiderProfile
);

export const RiderRoutes = router;
