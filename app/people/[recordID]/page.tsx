import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { auth } from "@clerk/nextjs/server";

type Metadata = undefined | { record_id: string };

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as Metadata;
  const userRecordID = metadata?.record_id;
  const isUsersProfile = userRecordID === recordID;
  return <ProfilePage guest={guest} isUsersProfile={isUsersProfile} />;
}
