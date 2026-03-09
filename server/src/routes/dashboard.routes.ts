// src/routes/dashboard.routes.ts
import { Router } from "express"
import { getUser } from "../controllers/dashboard.controller";

const router = Router();

router.get("/user", getUser);

export default router;
