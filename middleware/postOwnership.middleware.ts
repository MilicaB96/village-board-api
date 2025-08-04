import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
const { getPostById } = require("../repository/post.repository");

const postOwnershipMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this post" });
    }

    // Optionally, you can attach the post to the request object for use in the route handler
    req.post = post;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = { postOwnershipMiddleware };
