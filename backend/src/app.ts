import express from "express";
import userRoutes from "./routes/user.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});