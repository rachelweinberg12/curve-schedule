import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { auth } from "@clerk/nextjs/server";
import { getUserByEmail, getUserRecordID } from "@/db/auth";

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const guestAccount = await getUserByEmail(guest.Email);
  const userRecordID = getUserRecordID();
  const isUsersProfile = userRecordID === recordID;
  return (
    <ProfilePage
      guest={guest}
      isUsersProfile={isUsersProfile}
      guestAccount={guestAccount}
    />
  );
}
