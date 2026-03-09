import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.routes";

import UserRouter from "./routes/user.routes";
import reminderRoutes from "./routes/reminder.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { startReminderCron } from "./cronJobs/cron-job-runner";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// // 🔥 Dynamic CORS Middleware
// const dynamicCors = async (req: any, callback: any) => {
//   const origin = req.header('Origin');

//   try {
//     const tenants = await prisma.tenant.findMany({
//       select: {
//         customDomain: true,
//       },
//     });

//     const allowedOrigins = tenants
//       .map((tenant) => tenant.customDomain)
//       .filter(Boolean); // remove nulls

//       // 🔥 Include localhost for dev tools or local testing
//     allowedOrigins.push('localhost:5001'); // <-- Only the hostname part

//     const isAllowed = origin && allowedOrigins.includes(new URL(origin).hostname);

//     if (isAllowed) {
//       callback(null, {
//         origin: true,
//         credentials: true,
//       });
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   } catch (err) {
//     console.error('CORS error:', err);
//     callback(new Error('CORS error'));
//   }
// };

// // Attach CORS middleware with dynamic logic
// app.use(cors(dynamicCors));

// // Core middleware
// app.use(express.json());

// Schedule to run every 1 minutes
// ⏰ Start the cron job
startReminderCron();

console.log("APP RUNNED")
app.use("/api", UserRouter);

//app.use(tenantResolverMiddleware);
// Apply rate limiter middleware globally or to specific routes
//app.use(limiter);
app.use("/api/auth", authRoute);

app.use(authMiddleware);
app.use("/api", dashboardRoutes);

app.use("/api", reminderRoutes);


export default app;
