import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("authorization")?.replace(/^bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = { authMiddleware };
