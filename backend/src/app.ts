import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("hello");
});
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found", data: null });
});
app.use(errorHandler);
export default app;
