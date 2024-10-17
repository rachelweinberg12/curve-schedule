import { clerkClient } from "@clerk/nextjs/server";

export async function getUserByEmail(email: string) {
  const emailAddress = [email];
  const userList = await clerkClient.users.getUserList({
    emailAddress,
  });
  return userList.data[0];
}
