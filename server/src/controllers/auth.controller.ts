// controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { centralPrisma } from "../prisma-client/central-client";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {

    const normalizedEmail = email.trim().toLowerCase();

    // ADMIN LOGIN
    const getUser = await centralPrisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!getUser) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (getUser) {
      const valid = await bcrypt.compare(password, getUser.password);
      if (!valid) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        { id: getUser.id,  email: getUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
      );

      await centralPrisma.user.update({
        where: {
          id: getUser.id,
        },
        data: {
          currentSessionToken: token,
          lastLoginAt: new Date(),
        },
      });

      return res.json({
        message: "Login Successful",
        token: token,
        id: getUser.id,
        email: getUser.email,
        name: getUser.name,
      });
    }

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
