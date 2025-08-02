
import { Router } from 'express';
import { RatingController } from './rating.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import {
  createRatingZodSchema,
  getRatingsByRideIdZodSchema,
} from './rating.validation';

const router = Router();
const ratingController = RatingController;

router.post(
  '/',
  checkAuth(Role.RIDER, Role.DRIVER),
  validateRequest(createRatingZodSchema),
  ratingController.createRating
);

router.get(
  '/ride/:rideId',
  checkAuth(Role.RIDER, Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(getRatingsByRideIdZodSchema),
  ratingController.getRatingsByRideId
);

router.get(
  '/given/me',
  checkAuth(Role.RIDER, Role.DRIVER),
  ratingController.getRatingsGivenByUser
);

router.get(
  '/received/me',
  checkAuth(Role.RIDER, Role.DRIVER),
  ratingController.getRatingsReceivedByUser
);

router.get(
  '/admin',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ratingController.getAllRatings
);

export const RatingRoutes = router;
