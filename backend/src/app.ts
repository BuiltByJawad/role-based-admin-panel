import express, { type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { projectsRouter } from "./routes/projects.js";
import { statsRouter } from "./routes/stats.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

app.get("/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/stats", statsRouter);

app.use(errorHandler);

export { app };
