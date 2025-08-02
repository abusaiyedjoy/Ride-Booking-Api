
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

## ⚙️ Setup & Installation

### Prerequisites

*   **Node.js:** Version 18 or higher.
*   **MongoDB:** A running instance (local or cloud-hosted like MongoDB Atlas).

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ride-booking-api.git](https://github.com/your-username/ride-booking-api.git)
    cd ride-booking-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root directory of the project, create a file named `.env` and populate it with your environment variables.

    ```env
    PORT=5000
    DATABASE_URL=mongodb://localhost:27017/ride_booking_db
    NODE_ENV=development
    BCRYPT_SALT_ROUNDS=10
    JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here
    JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here
    JWT_ACCESS_EXPIRES_IN=1h
    JWT_REFRESH_EXPIRES_IN=7d
    ```
    *Replace `your_super_secret_jwt_access_key_here` and `your_super_secret_jwt_refresh_key_here` with strong, unique secrets.*

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The API server will start and be accessible at `http://localhost:5000` (or the port specified in your `.env` file).

## 🚀 API Endpoints

All endpoints are prefixed with `/api`.
**Base URL:** `https://assignment-5-ride-booking-api.vercel.app/api` (or `http://localhost:5000/api` for local development)

---

### **1. User Management (`/api/users`)**

| Method | Endpoint | Description | Role(s) | Request Body Example | Success Response Example |
| :----- | :------- | :---------- | :------ | :------------------- | :----------------------- |
| `POST` | `/register` | Register a new user with a specified role. | Public | `{ "email": "test@example.com", "password": "Password123", "role": "RIDER" }` | `201 Created` |
| `GET` | `/all-users` | Retrieve a list of all registered users. | `ADMIN` | None | `200 OK` |
| `PATCH` | `/:id` | Update user details (e.g., `isBlocked` status). | `ADMIN` | `{ "isBlocked": true }` | `200 OK` |

---

### **2. Rider Profile Management (`/api/riders`)**

| Method | Endpoint | Description | Role(s) | Request Body Example | Success Response Example |
| :----- | :------- | :---------- | :------ | :------------------- | :----------------------- |
| `POST` | `/register-profile` | Create a rider-specific profile for an existing user. | `RIDER` | `{ "userId": "{{USER_ID_RIDER}}", "phone": "+88017...", "paymentMethod": "Credit Card" }` | `201 Created` |
| `GET` | `/me` | Retrieve the authenticated rider's own profile. | `RIDER` | None | `200 OK` |
| `PATCH` | `/me` | Update the authenticated rider's own profile details. | `RIDER` | `{ "paymentMethod": "Bkash" }` | `200 OK` |
| `GET` | `/admin` | Retrieve a list of all rider profiles in the system. | `ADMIN` | None | `200 OK` |
| `GET` | `/admin/:id` | Retrieve a specific rider profile by its unique ID. | `ADMIN` | None | `200 OK` |

---

### **3. Driver Profile Management (`/api/drivers`)**

| Method | Endpoint | Description | Role(s) | Request Body Example | Success Response Example |
| :----- | :------- | :---------- | :------ | :------------------- | :----------------------- |
| `POST` | `/register-profile` | Create a driver-specific profile for an existing user. | `DRIVER` | `{ "userId": "{{USER_ID_DRIVER}}", "vehicleInfo": {... }, "driverLicenseNumber": "DLN-XYZ" }` | `201 Created` |
| `GET` | `/me` | Retrieve the authenticated driver's own profile. | `DRIVER` | None | `200 OK` |
| `PATCH` | `/me` | Update the authenticated driver's own profile details. | `DRIVER` | `{ "phoneNumber": "+88018..." }` | `200 OK` |
| `PATCH` | `/availability` | Set driver's online/offline status and current location. | `DRIVER` | `{ "status": "Online", "currentLocation": { "type": "Point", "coordinates": [lng, lat] } }` | `200 OK` |
| `GET` | `/admin` | Retrieve a list of all driver profiles. | `ADMIN` | None | `200 OK` |
| `PATCH` | `/admin/:id` | Admin approves or suspends a specific driver. | `ADMIN` | `{ "isApproved": true }` | `200 OK` |
| `GET` | `/:id` | Retrieve a specific driver profile by its ID. | `DRIVER` (self), `ADMIN` | None | `200 OK` |

---

### **4. Ride Management (`/api/rides`)**

| Method | Endpoint | Description | Role(s) | Request Body Example | Success Response Example |
| :----- | :------- | :---------- | :------ | :------------------- | :----------------------- |
| `POST` | `/request` | Rider requests a new ride with pickup and destination. | `RIDER` | `{ "pickupLocation": {... }, "destinationLocation": {... } }` | `201 Created` |
| `PATCH` | `/:id/accept` | Driver accepts a pending ride request. | `DRIVER` | None | `200 OK` |
| `PATCH` | `/:id/status` | Driver updates ride status (e.g., `picked_up`, `in_transit`, `completed`). | `DRIVER` | `{ "status": "picked_up" }` | `200 OK` |
| `PATCH` | `/:id/cancel` | Rider cancels their ride request. | `RIDER` | `{ "reason": "Changed my mind" }` | `200 OK` |
| `PATCH` | `/admin/:id/status` | Admin force-updates the status of any ride. | `ADMIN` | `{ "status": "cancelled" }` | `200 OK` |
| `GET` | `/history/me` | Retrieve the authenticated rider's ride history. | `RIDER` | None | `200 OK` |
| `GET` | `/history/driver` | Retrieve the authenticated driver's ride history. | `DRIVER` | None | `200 OK` |
| `GET` | `/admin` | Retrieve a list of all rides in the system. | `ADMIN` | None | `200 OK` |
| `GET` | `/drivers/available` | Find available drivers near a given location. | Public/`RIDER` | Query: `?lat=23.777&lng=90.399&maxDistanceKm=5` | `200 OK` |
| `GET` | `/:id` | Retrieve details of a specific ride by its ID. | `RIDER` (self), `DRIVER` (self), `ADMIN` | None | `200 OK` |

---

### **5. Rating Management (`/api/ratings`)**

| Method | Endpoint | Description | Role(s) | Request Body Example | Success Response Example |
| :----- | :------- | :---------- | :------ | :------------------- | :----------------------- |
| `POST` | `/` | Create a new rating (rider to driver, or driver to rider). | `RIDER`, `DRIVER` | `{ "rideId": "{{RIDE_ID}}", "ratedId": "{{USER_ID_DRIVER}}", "rating": 5, "type": "riderToDriver" }` | `201 Created` |
| `GET` | `/ride/:rideId` | Retrieve all ratings associated with a specific ride. | `RIDER` (self), `DRIVER` (self), `ADMIN` | None | `200 OK` |
| `GET` | `/given/me` | Retrieve ratings submitted by the authenticated user. | `RIDER`, `DRIVER` | None | `200 OK` |
| `GET` | `/received/me` | Retrieve ratings received by the authenticated user. | `RIDER`, `DRIVER` | None | `200 OK` |
| `GET` | `/admin` | Retrieve a list of all ratings in the system. | `ADMIN` | None | `200 OK` |

---

## 🧪 Testing & Documentation

*   **Postman:** The API endpoints can be thoroughly tested using Postman or similar API testing tools. A detailed Postman collection with example requests and environment variables can be provided to facilitate testing.
*   **README.md:** This file serves as the primary documentation for the project, outlining its features, setup, and API usage.
*   **Video Demonstration:** A screen-recorded video demonstrating the core functionalities (User Authentication, Rider features, Driver features, Admin features, and an end-to-end Postman demo) is available as part of the project's evaluation.

## 🤝 Contributing

Contributions are highly encouraged and welcome\! If you find any bugs, have suggestions for improvements, or wish to add new features, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.


````
