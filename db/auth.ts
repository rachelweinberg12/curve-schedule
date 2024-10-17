import { auth, clerkClient } from "@clerk/nextjs/server";

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
