import { Request, Response, NextFunction } from "express";
const userRegistrationSchema = require("../schemas/userRegistation.schema");
const { getUserByUsername } = require("../repository/auth.repository");
import { ZodError } from "zod";

const validationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First, validate the schema
    userRegistrationSchema.parse(req.body);

    // Then check if username is unique
    const { username } = req.body;
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({
        error: "Invalid data",
        details: [{ username: "Username already exists" }],
      });
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue: any) => ({
        [issue.path[0]]: issue.message,
      }));
      res.status(400).json({ error: "Invalid data", details: errorMessages });
    } else {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = { validationMiddleware };
