import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

const { areFriends } = require("../repository/friends.repisotory");

const friendsMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const friendId = req.params.friendId;
    const userId = req.userId;

    const isFriend = await areFriends(userId, friendId);

    if (!isFriend) {
      return res
        .status(403)
        .json({ error: "Access denied. Users are not friends." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to check friendship status" });
  }
};

module.exports = friendsMiddleware;
