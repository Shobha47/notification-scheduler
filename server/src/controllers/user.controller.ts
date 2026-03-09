// controllers/userController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { centralPrisma } from "../prisma-client/central-client";

export async function registerUserController(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      password,
      contact,
      country,
      state,
      city,
      zipCode,
      fullAddress,
    } = req.body;

    console.log("REQ>BODY FOR:", req.body);

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    // ✅ Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // ✅ Check existing user
    const existingUser = await centralPrisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with this email",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await centralPrisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        contact: contact || null,
        country: country || null,
        state: state || null,
        city: city || null,
        zipCode: zipCode || null,
        fullAddress: fullAddress || null,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (err: any) {
    console.error("User registration error:", err);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}