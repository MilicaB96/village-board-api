import { Friend } from "../interfaces/friends.interface";

const friends: Friend[] = require("../data/friends.json");
async function areFriends(userId: string, friendId: string): Promise<boolean> {
  const userFriendList = friends.find((user) => user.userId === userId);
  return userFriendList?.friends.includes(friendId) || false;
}

module.exports = { areFriends };
