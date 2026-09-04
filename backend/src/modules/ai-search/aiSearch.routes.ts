import { Router } from "express";
import { search } from "./aiSearch.controller.js";

const router = Router();

router.post("/search", search);

export default router;
