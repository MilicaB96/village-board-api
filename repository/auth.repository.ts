import { User } from "../interfaces/user.interface";
const users = require("../data/users.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");

async function getUserByUsername(username: string) {
  return users.find((user: User) => user.username === username);
}

async function createUser(user: Omit<User, "id">) {
  const newUser = { ...user, id: uuidv4() };
  users.push(newUser);

  // Write updated users back to the JSON file
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    return newUser;
  } catch (error) {
    console.error("Error writing to users.json:", error);
    // Remove the user from memory if file write failed
    users.pop();
    throw new Error("Failed to create user");
  }
}

module.exports = { getUserByUsername, createUser };
