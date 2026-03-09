// /src/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { ReturnType } from 'utility-types'; // optional, or just inline typeof

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
