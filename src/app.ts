import express, { type Express } from "express";
import surveyRoutes from "./routes/surveyRoutes.js";

const app: Express = express();
app.use(express.json());

app.use("/api/v1/surveys", surveyRoutes);

export default app;
