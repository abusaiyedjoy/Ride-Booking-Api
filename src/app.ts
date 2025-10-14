import express, { Request, Response } from "express";
import cors from "cors";
import expressSession from "express-session";
import passport from "passport"
import cookieParser from "cookie-parser";
import { router } from "./app/router";
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";
import "./app/config/passport";

const app = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
    "https://ride-booking-chi.vercel.app",
      "https://ride-booking-management.netlify.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking Backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;