// src/controllers/dashboardController.ts

import { Request, Response } from "express";
import { centralPrisma } from "../prisma-client/central-client";

export async function getUser(req: Request, res: Response) {
  try {

    const userId = (req as any).user?.id;
    console.log("GET REQ USER ID:", userId);


    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await centralPrisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        country: true,
        state: true,
        city: true,
        zipCode: true,
        fullAddress: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });

  } catch (err) {
    console.error("Error fetching user:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}