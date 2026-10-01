import { csrfSync } from "csrf-sync";
import { Request, Response, NextFunction } from "express";
export const { generateToken, csrfSynchronisedProtection } = csrfSync({ getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string });
export const csrfTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = generateToken(req);
  res.cookie("csrftoken", token, { sameSite: "lax" });
  next();
}
