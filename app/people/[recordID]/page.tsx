import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { auth } from "@clerk/nextjs/server";
import { getUserByEmail } from "@/db/auth";

type Metadata = undefined | { record_id: string };

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const guestAccount = await getUserByEmail(guest.Email);
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as Metadata;
  const userRecordID = metadata?.record_id;
  const isUsersProfile = userRecordID === recordID;
  return (
    <ProfilePage
      guest={guest}
      isUsersProfile={isUsersProfile}
      guestAccount={guestAccount}
    />
  );
}
