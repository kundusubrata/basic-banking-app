
import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { userRouter } from "./routes/user.route.js";
import { globalErrorMiddleware } from "./middlewares/globalErrorMiddleware.js";
import cookieParser from "cookie-parser";
import { accountRouter } from "./routes/account.route.js";

dotenv.config({ path: "./config/config.env" });

connectDatabase();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.use(globalErrorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`The server is listening on: http://localhost:${process.env.PORT}`);
});

