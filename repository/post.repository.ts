import { Post } from "../interfaces/post.interface";
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const posts = require("../data/posts");
const postsFilePath = path.join(__dirname, "../data/posts.json");

async function getPostById(id: string) {
  return posts.find((post: Post) => post.id === id);
}

async function getPostsByUserId(userId: string) {
  return posts.filter((post: Post) => post.userId === userId);
}

async function createPost(
  postData: Omit<Post, "id" | "createdAt | userId">,
  userId: string
) {
  const newPost: Post = {
    id: uuidv4(),
    userId: userId,
    createdAt: new Date().toISOString(),
    ...postData,
  };

  posts.push(newPost);

  // Write updated posts back to the JSON file
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
    return newPost;
  } catch (error) {
    console.error("Error writing to posts.json:", error);
    // Remove the post from memory if file write failed
    posts.pop();
    throw new Error("Failed to create post");
  }
}

async function deletePost(id: string) {
  const postIndex = posts.findIndex((post: Post) => post.id === id);

  if (postIndex === -1) {
    return false; // Post not found
  }

  // Remove the post from the array
  posts.splice(postIndex, 1);

  // Write updated posts back to the JSON file
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to posts.json:", error);
    return false;
  }
}

async function updatePost(id: string, postData: Omit<Post, "id">) {
  const postIndex = posts.findIndex((post: Post) => post.id === id);

  if (postIndex === -1) {
    return null; // Post not found
  }

  // Update the post while keeping the original id
  const updatedPost: Post = {
    id,
    createdAt: posts[postIndex].createdAt,
    userId: posts[postIndex].userId,
    ...postData,
  };
  posts[postIndex] = updatedPost;

  // Write updated posts back to the JSON file
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
    return updatedPost;
  } catch (error) {
    console.error("Error writing to posts.json:", error);
    return null;
  }
}

module.exports = {
  getPostById,
  getPostsByUserId,
  createPost,
  deletePost,
  updatePost,
};
