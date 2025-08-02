"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = require("express");
const ride_controller_1 = require("./ride.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const ride_validation_1 = require("./ride.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
const rideController = ride_controller_1.RideController;
router.get('/drivers/available', (0, validateRequest_1.validateRequest)(ride_validation_1.findAvailableDriversZodSchema), rideController.findAvailableDrivers);
// Rider-specific routes
router.post('/request', (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), (0, validateRequest_1.validateRequest)(ride_validation_1.requestRideZodSchema), rideController.requestRide);
router.patch('/:id/cancel', (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), (0, validateRequest_1.validateRequest)(ride_validation_1.cancelRideZodSchema), rideController.cancelRide);
router.get('/history/me', (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), rideController.getRiderRideHistory);
// Driver-specific routes
router.patch('/:id/accept', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(ride_validation_1.acceptRideZodSchema), rideController.acceptRide);
router.patch('/:id/status', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(ride_validation_1.updateRideStatusZodSchema), rideController.updateRideStatus);
router.get('/history/driver', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), rideController.getDriverRideHistory);
// Admin-specific routes
router.patch('/admin/:id/status', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(ride_validation_1.adminUpdateRideStatusZodSchema), rideController.adminUpdateRideStatus);
router.get('/admin', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), rideController.getAllRides);
// Shared route: Allow all authenticated roles to attempt to view
router.get('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.DRIVER, user_interface_1.Role.RIDER), rideController.getRideById);
exports.RideRoutes = router;
