// routes/UserRouter.ts
import { Router } from "express";
import { registerUserController } from "../controllers/user.controller";

const router = Router();

console.log("USER CONTROLLER")

router.post("/create-user", registerUserController);

export default router;
