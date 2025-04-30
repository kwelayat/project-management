import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import { connect } from "http2";
import connectDatabase from "./config/database.config";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(
  "/",
  asyncHandler((req: Request, res: Response, next: NextFunction): any => {
    throw new BadRequestException("This is a bad request",ErrorCodeEnum.AUTH_INVALID_TOKEN);
    res.status(HTTPSTATUS.OK).json({ message: "Welcome to the Backend" });
  })
);

app.use(errorHandler);
app.listen(config.PORT, async () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
  await connectDatabase();
});
