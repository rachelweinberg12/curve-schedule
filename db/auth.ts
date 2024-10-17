import { auth, clerkClient, EmailAddress } from "@clerk/nextjs/server";

export type SimpleUser = {
  id: string;
  imageUrl: string;
  recordID: string;
};

export async function getUserByEmail(email: string) {
  const emailAddress = [email];
  const userList = await clerkClient.users.getUserList({
    emailAddress,
  });
  return userList.data[0];
}

type Metadata = undefined | { record_id: string };
export function getUserRecordID() {
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as Metadata;
  const userRecordID = metadata?.record_id;
  return userRecordID;
}

export async function getUsers() {
  const userList = await clerkClient.users.getUserList();
  const simpleUsers = userList.data.map((user) => ({
    id: user.id,
    imageUrl: user.imageUrl,
    recordID: user.publicMetadata.record_id,
  })) as SimpleUser[];
  return simpleUsers;
}