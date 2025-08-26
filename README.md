# 🚕 Ride Booking API

## 🚀 Project Overview

This project delivers a robust, secure, and scalable backend API for a comprehensive ride-booking system, drawing inspiration from platforms like Uber and Pathao. Developed with **Node.js**, **Express.js**, and **Mongoose**, it provides a seamless interface for riders to request and manage rides, drivers to accept and complete trips, and administrators to oversee the entire ecosystem.

The API is meticulously designed with a modular architecture, strong authentication mechanisms, and fine-grained role-based authorization to ensure data integrity, system reliability, and a smooth user experience.

## 🌐 Live Demo

[**https://assignment-5-ride-booking-api.vercel.app**](https://assignment-5-ride-booking-api.vercel.app)

## ✨ Features

### Minimum Functional Requirements

* ✅ **JWT-based Authentication**
* ✅ **Secure Password Hashing**
* ✅ **Role-based Authorization**
* ✅ **Rider Capabilities**

  * Request, cancel, and view ride history
* ✅ **Driver Capabilities**

  * Accept/reject rides, update ride status, view earnings, toggle availability
* ✅ **Admin Capabilities**

  * Manage users and drivers, generate reports
* ✅ **Complete Ride History Tracking**
* ✅ **Modular Code Architecture**
* ✅ **RESTful API Endpoints with Proper Status Codes**

### Bonus Features

* ✅ **Driver Ratings**
* ✅ **Rider Feedback System**
* ✅ **Geo-based Driver Search**

## 🛠️ Technologies Used

* **Backend Framework:** Node.js with Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Language:** TypeScript
* **Authentication:** JWT
* **Hashing:** bcryptjs
* **Validation:** Zod
* **Error Handling:** Custom `AppError`
* **Dev Tools:** Nodemon, ts-node

## 📁 Project Structure

```
src/
├── config/             # Configurations
├── middlewares/        # Middlewares
├── modules/            # Application modules
│   ├── user/           # User logic
│   ├── rider/          # Rider profile
│   ├── driver/         # Driver profile
│   ├── ride/           # Ride logic
│   └── rating/         # Ratings and feedback
├── utils/              # Helper functions
├── app.ts              # Express setup
├── server.ts           # Entry point
└── errorManage/        # Custom error definitions
```

## ⚙️ Setup & Installation

### Prerequisites

* **Node.js v18+**
* **MongoDB (local or Atlas)**

## 🚀 API Endpoints

**Base URL:** `https://assignment-5-ride-booking-api.vercel.app/api/v1`

---

### 1. User Management `/api/users`

| Method | Endpoint     | Description              | Role(s) |
| ------ | ------------ | ------------------------ | ------- |
| POST   | `/register`  | Register a new user      | Public  |
| GET    | `/all-users` | Get all registered users | ADMIN   |
| PATCH  | `/:id`       | Update user details      | ADMIN   |

---

### 2. Rider Profile `/api/riders`

| Method | Endpoint            | Description                | Role(s) |
| ------ | ------------------- | -------------------------- | ------- |
| POST   | `/register-profile` | Create rider profile       | RIDER   |
| GET    | `/me`               | Get own rider profile      | RIDER   |
| PATCH  | `/me`               | Update own rider profile   | RIDER   |
| GET    | `/admin`            | Get all riders             | ADMIN   |
| GET    | `/admin/:id`        | Get specific rider profile | ADMIN   |

---

### 3. Driver Profile `/api/drivers`

| Method | Endpoint            | Description                      | Role(s)       |
| ------ | ------------------- | -------------------------------- | ------------- |
| POST   | `/register-profile` | Create driver profile            | DRIVER        |
| GET    | `/me`               | Get own driver profile           | DRIVER        |
| PATCH  | `/me`               | Update own driver profile        | DRIVER        |
| PATCH  | `/availability`     | Update availability and location | DRIVER        |
| GET    | `/admin`            | Get all drivers                  | ADMIN         |
| PATCH  | `/admin/:id`        | Approve/suspend driver           | ADMIN         |
| GET    | `/:id`              | Get specific driver profile      | DRIVER, ADMIN |

---

### 4. Ride Management `/api/rides`

| Method | Endpoint             | Description                   | Role(s)              |
| ------ | -------------------- | ----------------------------- | -------------------- |
| POST   | `/request`           | Request a ride                | RIDER                |
| PATCH  | `/:id/accept`        | Accept ride                   | DRIVER               |
| PATCH  | `/:id/status`        | Update ride status            | DRIVER               |
| PATCH  | `/:id/cancel`        | Cancel ride                   | RIDER                |
| PATCH  | `/admin/:id/status`  | Admin updates ride status     | ADMIN                |
| GET    | `/history/me`        | Rider ride history            | RIDER                |
| GET    | `/history/driver`    | Driver ride history           | DRIVER               |
| GET    | `/admin`             | All rides                     | ADMIN                |
| GET    | `/drivers/available` | Find nearby available drivers | Public / RIDER       |
| GET    | `/:id`               | Get ride details by ID        | RIDER, DRIVER, ADMIN |

---

### 5. Ratings `/api/ratings`

| Method | Endpoint        | Description               | Role(s)        |
| ------ | --------------- | ------------------------- | -------------- |
| POST   | `/`             | Create rating             | RIDER, DRIVER  |
| GET    | `/ride/:rideId` | Get ride ratings          | All Auth Roles |
| GET    | `/given/me`     | Ratings submitted by user | RIDER, DRIVER  |
| GET    | `/received/me`  | Ratings received by user  | RIDER, DRIVER  |
| GET    | `/admin`        | All ratings               | ADMIN          |

---

## 🧪 Testing & Documentation

* **Postman:** Fully testable endpoints with body examples.
* **Video:** End-to-end functionality demonstration included.

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit and push changes
4. Open a Pull Request

