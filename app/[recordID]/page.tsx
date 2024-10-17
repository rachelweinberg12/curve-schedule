import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { getUserByEmail, getUserRecordID } from "@/db/auth";
import { getSessionsByHost } from "@/db/sessions";
import { getLocations } from "@/db/locations";

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const guestAccount = await getUserByEmail(guest.Email);
  const sessionsHosting = await getSessionsByHost(guest.Name);
  const locations = await getLocations();
  const userRecordID = getUserRecordID();
  const isUsersProfile = userRecordID === recordID;
  return (
    <ProfilePage
      profile={guest}
      sessionsHosting={sessionsHosting}
      locations={locations}
      isUsersProfile={isUsersProfile}
      account={guestAccount}
    />
  );
}
