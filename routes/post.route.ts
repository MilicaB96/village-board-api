import type { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
const { Router } = require("express");
const {
  getPostsByUserId,
  getPostById,
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
const friendsMiddleware = require("../middleware/friends.middleware");

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

//get friends posts
postRouter.get(
  "/friends/:friendId",
  authMiddleware,
  friendsMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const friendId = req.params.friendId;

      if (!friendId) {
        return res.status(400).json({ message: "Friend ID is required" });
      }

      const posts = await getPostsByUserId(friendId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

//get friends post
postRouter.get(
  "/friends/:friendId/:postId",
  authMiddleware,
  friendsMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const friendId = req.params.friendId;
      const postId = req.params.postId;

      const post = await getPostById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Ensure the post belongs to the friend we're trying to access
      if (post.userId.toString() !== friendId.toString()) {
        return res.status(403).json({
          message: "This post does not belong to the specified friend",
        });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
);

module.exports = postRouter;
