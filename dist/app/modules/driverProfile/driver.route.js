"use strict";
// src/modules/driver/driver.route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = require("express");
const driver_controller_1 = require("./driver.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const driver_validation_1 = require("./driver.validation");
const router = (0, express_1.Router)();
const driverController = driver_controller_1.DriverController;
// Driver-specific routes
router.post('/register-profile', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.createDriverProfileZodSchema), driverController.createDriverProfile);
router.get('/me', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driverController.getDriverProfile);
router.patch('/me', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.updateDriverProfileZodSchema), driverController.updateDriverProfile);
router.patch('/availability', (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.setAvailabilityStatusZodSchema), driverController.setAvailabilityStatus);
router.get('/admin', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), driverController.getAllDrivers);
router.patch('/admin/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(driver_validation_1.adminUpdateDriverProfileZodSchema), driverController.adminUpdateDriverProfile);
router.get('/:id', (0, checkAuth_1.checkAuth)(), (0, validateRequest_1.validateRequest)(driver_validation_1.getDriverProfileByIdZodSchema), driverController.getDriverProfile);
exports.DriverRoutes = router;
