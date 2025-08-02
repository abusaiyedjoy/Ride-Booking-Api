
# 🚕 Ride Booking API

## 🚀 Project Overview

This project delivers a robust, secure, and scalable backend API for a comprehensive ride-booking system, drawing inspiration from platforms like Uber and Pathao. Developed with **Node.js**, **Express.js**, and **Mongoose**, it provides a seamless interface for riders to request and manage rides, drivers to accept and complete trips, and administrators to oversee the entire ecosystem. The API is meticulously designed with a modular architecture, strong authentication mechanisms, and fine-grained role-based authorization to ensure data integrity, system reliability, and a smooth user experience.

## 🌐 Live Demo

Experience the API live and interact with its functionalities:
[**https://assignment-5-ride-booking-api.vercel.app**](https://assignment-5-ride-booking-api.vercel.app)

## ✨ Features

### Minimum Functional Requirements

  * ✅ **JWT-based Authentication:** Implements a secure login system supporting three distinct roles: `ADMIN`, `RIDER`, and `DRIVER`.
  * ✅ **Secure Password Hashing:** Utilizes `bcryptjs` for robust password hashing, protecting user credentials.
  * ✅ **Role-based Authorization:** Ensures granular access control, restricting users to functionalities aligned with their assigned roles.
  * ✅ **Rider Capabilities:**
      * Request a ride by specifying pickup and destination locations.
      * Cancel a ride within a predefined allowed window.
      * View their complete ride history.
  * ✅ **Driver Capabilities:**
      * Accept or reject incoming ride requests.
      * Update ride status through a defined lifecycle (Picked Up → In Transit → Completed).
      * View their earnings history.
      * Set their availability status (Online/Offline).
  * ✅ **Admin Capabilities:**
      * View all registered users, driver profiles, and ride records.
      * Approve or suspend driver accounts.
      * Block or unblock user accounts.
      * Access data for generating various system reports.
  * ✅ **Complete Ride History:** Every ride is stored with a full historical record, including timestamps for each status transition, ensuring auditability.
  * ✅ **Modular Code Architecture:** The codebase is organized into distinct modules (User, Rider, Driver, Ride, Rating) for enhanced maintainability, readability, and future scalability.
  * ✅ **Proper API Endpoints:** Adheres to RESTful conventions, utilizing appropriate HTTP status codes and clear response messages for effective communication.

### Bonus Considerations Implemented

  * ✅ **Driver Ratings:** Allows riders to provide ratings and feedback for drivers after a completed ride.
  * ✅ **Rider Feedback System:** Enables drivers to rate and provide feedback for riders.
  * ✅ **Geo-based Driver Search:** Facilitates efficient searching for available drivers within a specified geographical radius.

## 🛠 Technologies Used

  * **Backend Framework:** Node.js with Express.js
  * **Database:** MongoDB
  * **ODM (Object Data Modeling):** Mongoose
  * **Language:** TypeScript
  * **Authentication:** JSON Web Tokens (JWT)
  * **Password Hashing:** bcryptjs
  * **Validation:** Zod
  * **HTTP Status Codes:** `http-status-codes` library
  * **Error Handling:** Custom `AppError` class for standardized error responses
  * **Development Tools:** Nodemon (for live reloading), Ts-node (for running TypeScript directly)

## 📁 Project Structure

The project follows a modular, production-ready architecture:
src/
├── config/             \# Environment variables and configurations
├── middlewares/        \# Authentication, validation, and error handling middlewares
├── modules/            \# Core application modules
│   ├── user/           \# User authentication and management
│   │   ├── user.controller.ts
│   │   ├── user.interface.ts
│   │   ├── user.model.ts
│   │   ├── user.route.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   ├── rider/          \# Rider profile management
│   │   ├── rider.controller.ts
│   │   ├── rider.interface.ts
│   │   ├── rider.model.ts
│   │   ├── rider.route.ts
│   │   ├── rider.service.ts
│   │   └── rider.validation.ts
│   ├── driver/         \# Driver profile and availability management
│   │   ├── driver.controller.ts
│   │   ├── driver.interface.ts
│   │   ├── driver.model.ts
│   │   ├── driver.route.ts
│   │   ├── driver.service.ts
│   │   └── driver.validation.ts
│   ├── ride/           \# Ride request, lifecycle, and history management
│   │   ├── ride.controller.ts
│   │   ├── ride.interface.ts
│   │   ├── ride.model.ts
│   │   ├── ride.route.ts
│   │   ├── ride.service.ts
│   │   └── ride.validation.ts
│   └── rating/         \# Rating and feedback system
│       ├── rating.controller.ts
│       ├── rating.interface.ts
│       ├── rating.model.ts
│       ├── rating.route.ts
│       ├── rating.service.ts
│       └── rating.validation.ts
├── utils/              \# Utility functions (JWT, sendResponse)
├── app.ts              \# Express application setup and global middlewares
├── server.ts           \# Server entry point and database connection
└── errorManage/        \# Custom error handling definitions
└── appError.ts

````


