import express, { type Express, type Request, type Response } from "express";
import surveyRouter from "./routes/surveyRouter.js";
import userRouter from "./routes/userRouter.js";
import { ErrorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import AppError from "./utils/appError.js";
import limiter from "./utils/limiter.js";

const app: Express = express();
const errorMiddleware = new ErrorMiddleware();

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

app.use(errorMiddleware.handleGlobalError);

export default app;
