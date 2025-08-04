import { Request } from "express";
import { Post } from "./post.interface";

export interface AuthenticatedRequest extends Request {
  userId: string;
  post?: Post;
}
