import express, { type Express, type Request, type Response } from "express";
import surveyRouter from "./routes/surveyRouter.js";
import userRouter from "./routes/userRouter.js";
import { ErrorController } from "./controllers/errorController.js";

const app: Express = express();
const errorController = new ErrorController();

app.use(express.json());

app.use("/api/v1/surveys", surveyRouter);
app.use("/api/v1/users", userRouter);

app.use(errorController.globalErrorHandler);

// app.all("*", (req: Request, res: Response) => {
//   res.send("Not found");
// });

export default app;
