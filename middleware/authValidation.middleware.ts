import { Request, Response, NextFunction } from "express";
const userRegistrationSchema = require("../schemas/userRegistation.schema");
import { ZodError } from "zod";

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userRegistrationSchema.parse(req.body);
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
