import type { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
const { Router } = require("express");
const {
  getPostsByUserId,
  deletePost,
  updatePost,
  createPost,
} = require("../repository/post.repository");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  postOwnershipMiddleware,
} = require("../middleware/postOwnership.middleware");
const {
  postValidationMiddleware,
} = require("../middleware/postValidation.middleware");
const postRouter = Router();
const postLimitMiddleware = require("../middleware/postLimit.middleware");

//get my posts
postRouter.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId;
      const posts = await getPostsByUserId(userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//get my post
postRouter.get(
  "/:id",
  authMiddleware,
  postOwnershipMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const post = req.post;
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//delete
postRouter.delete(
  "/:id",
  authMiddleware,
  postOwnershipMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postId = req.post.id;
      const deleted = deletePost(postId);
      if (!deleted) {
        res.status(404).json({ message: "No post found" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//update
//i have to add validation middleware !!!!
postRouter.put(
  "/:id",
  authMiddleware,
  postOwnershipMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const postId = req.post.id;
      const newPost = await updatePost(postId, req.body);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//new
//i have to add validation middleware and post limitation !!!!
postRouter.post(
  "/",
  authMiddleware,
  postLimitMiddleware,
  postValidationMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const newPost = await createPost(req.body, req.userId);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//get friends posts -later
//crud my post (get *, else only token userId)

module.exports = postRouter;
