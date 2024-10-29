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
type SessionClaims = {
  metadata: Metadata;
  imageUrl?: string;
  clerkID?: string;
};
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

export function getUserSessionClaims() {
  const { sessionClaims } = auth();
  return sessionClaims as unknown as SessionClaims;
}

export async function getUsers() {
  let allUsers: SimpleUser[] = [];
  let pageNumber = 1;

  while (true) {
    const userList = await clerkClient.users.getUserList({
      limit: 100, // maximum allowed by Clerk
      offset: (pageNumber - 1) * 100,
    });

    if (userList.data.length === 0) {
      break;
    }

    const simpleUsers = userList.data.map((user) => ({
      id: user.id,
      imageUrl: user.imageUrl,
      recordID: user.publicMetadata.record_id,
    })) as SimpleUser[];

    allUsers = [...allUsers, ...simpleUsers];

    if (userList.data.length < 100) {
      break;
    }

    pageNumber++;
  }

  return allUsers;
}
