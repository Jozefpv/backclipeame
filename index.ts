import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.js";
import apiRouter from "./routes/api/api.js";
import dashboardRotuer from "./routes/dashboard/dashboard.js";
import scrapRouter from "./routes/scrap/scrap.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://jozefpv.github.io",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/dashboard", dashboardRotuer);
app.use("/scrap", scrapRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
