// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { centralPrisma } from "../prisma-client/central-client";
dotenv.config({ path: ".env" });

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
      tenantInfo?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Raw Jwt Token:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  //const token = req.headers.authorization
  console.log("Jwt Token:", token);

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;

    console.log("decoded", decoded);

    const id = decoded.id;
    const email = decoded.email;


    if (!email) {
      return res
        .status(401)
        .json({ error: "Invalid token: Missing email or customDomain" });
    }

    console.log("🔐 Decoded JWT -> Id:", id);
    console.log("🔐 Decoded JWT -> Email:", email);


    const dbUser = await centralPrisma.user.findUnique({
        where: { id: id },
        select: { currentSessionToken: true },
      });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found" });
    }

    // 🚨 Single Device Check
    const incomingToken = token;

    if (dbUser.currentSessionToken !== incomingToken) {
      return res.status(401).json({
        error:
          "You have been logged out because your account was used on another device.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
