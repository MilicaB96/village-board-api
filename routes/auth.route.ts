import type { Request, Response } from "express";
const { Router } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  getUserByUsername,
  createUser,
} = require("../repository/auth.repository");
const {
  validationMiddleware,
} = require("../middleware/authValidation.middleware");

const authRouter = Router();
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
});

authRouter.post(
  "/register",
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await createUser({ username, password: hash, email });
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "Internal error" });
    }
  }
);

module.exports = authRouter;
