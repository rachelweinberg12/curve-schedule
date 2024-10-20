import { auth, clerkClient } from "@clerk/nextjs/server";

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
  const simpleUser =
    userList && userList.data.length > 0
      ? ({
          id: userList.data[0].id,
          imageUrl: userList.data[0].imageUrl,
          recordID: userList.data[0].publicMetadata.record_id,
        } as SimpleUser)
      : undefined;
  return simpleUser;
}

type Metadata = undefined | { record_id: string; slug: string };
export function getUserRecordID() {
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as Metadata;
  const userRecordID = metadata?.record_id;
  return userRecordID;
}

export function getUserSlug() {
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as Metadata;
  const userSlug = metadata?.slug;
  return userSlug;
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
