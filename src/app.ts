import express, { type Express, type Request, type Response } from "express";
import surveyRouter from "./routes/surveyRouter.js";
import userRouter from "./routes/userRouter.js";
import { ErrorController } from "./controllers/errorController.js";
import cookieParser from "cookie-parser";
import AppError from "./utils/appError.js";
import rateLimit from "express-rate-limit";
import { json } from "./utils/json.js";
import limiter from "./utils/limiter.js";

const app: Express = express();
const errorController = new ErrorController();

app.use(express.json());
app.use(cookieParser());

app.use("/api/", limiter(false));

app.use("/api/v1/surveys", surveyRouter);
app.use("/api/v1/users", limiter(true), userRouter);

app.all("/*splat", (req: Request, res: Response) => {
  throw new AppError(
    `The route ${req.originalUrl} does not exist for method ${req.method}`,
    404,
  );
});

app.use(errorController.globalErrorHandler);

export default app;
