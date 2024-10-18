import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { getUserByEmail, getUserRecordID } from "@/db/auth";
import { getSessionsByHost, getSessionsByIDs } from "@/db/sessions";
import { getLocations } from "@/db/locations";
import { getRSVPsByUser } from "@/db/rsvps";

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const guestAccount = await getUserByEmail(guest.Email);
  const sessionsHosting = await getSessionsByHost(guest.Name);
  const locations = await getLocations();
  const userRecordID = getUserRecordID();
  const isUsersProfile = userRecordID === recordID;
  const rsvps = await getRSVPsByUser(recordID);
  const rsvpdSessionIDs = rsvps.map((rsvp) => rsvp["Session"]);
  const rsvpdSessions = await getSessionsByIDs(rsvpdSessionIDs);
  console.log(rsvpdSessionIDs);
  console.log(rsvpdSessions);
  return (
    <div className="max-w-4xl mx-auto">
      <ProfilePage
        profile={guest}
        sessionsHosting={sessionsHosting}
        locations={locations}
        isUsersProfile={isUsersProfile}
        account={guestAccount}
        rsvpdSessions={rsvpdSessions}
      />
    </div>
  );
}
