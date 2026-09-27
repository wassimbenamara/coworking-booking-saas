import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";

interface JwtPayload {
  sub: string;
  email: string;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      authConfig.jwtSecret
    ) as JwtPayload;

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}