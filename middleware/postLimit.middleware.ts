import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
const { getPostsByUserId } = require("../repository/post.repository");

const postLimitMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const posts = await getPostsByUserId(userId);

    if (posts && posts.length >= 10) {
      res.status(400).json({
        message: "Post limit reached. Maximum 10 posts allowed per user.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking post limit:", error);
    res.status(500).json({ message: "Internal error" });
  }
};

module.exports = postLimitMiddleware;
