import express from "express";
import userRoutes from "./modules/users/users.routes.js";
import recommendationRoutes from "./modules/recommendations/recommendations.routes.js";

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