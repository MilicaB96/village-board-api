import { User } from "../interfaces/user.interface";
const users = require("../data/users.json");
const { v4: uuidv4 } = require("uuid");

async function getUserByUsername(username: string) {
  return users.find((user: User) => user.username === username);
}

async function createUser(user: Omit<User, "id">) {
  const newUser = { ...user, id: uuidv4() };
  users.push(newUser);
  return newUser;
}

module.exports = { getUserByUsername, createUser };
