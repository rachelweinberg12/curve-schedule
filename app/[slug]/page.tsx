import { getGuestBySlug } from "@/db/guests";
import { ProfilePage } from "./profile-page";
import { getUserByEmail, getUserRecordID, getUserSlug } from "@/db/auth";
import { getSessionsByExpHosts, getSessionsByIDs } from "@/db/sessions";
import { getLocations } from "@/db/locations";
import { getRSVPsByUser } from "@/db/rsvps";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { slug: string } }) {
  const { slug } = props.params;
  const decodedSlug = decodeURIComponent(slug);

  // If the slug is "me", redirect to the user's actual slug
  if (slug === "me") {
    const userSlug = getUserSlug();
    if (!userSlug) {
      return redirect("/sign-in");
    }
    return redirect(`/${userSlug}`);
  }

  const guest = await getGuestBySlug(decodedSlug);
  if (!guest) {
    return <div>Profile not found</div>;
  }
  const [guestAccount, sessionsHosting, locations, userRecordID, rsvps] =
    await Promise.all([
      getUserByEmail(guest.Email),
      getSessionsByExpHosts(guest.Name),
      getLocations(),
      getUserRecordID(),
      getRSVPsByUser(guest.ID),
    ]);
  const isUsersProfile = userRecordID === guest.ID;
  const rsvpdSessionIDs = rsvps.map((rsvp) => rsvp["Session"]);
  const rsvpdSessions = await getSessionsByIDs(rsvpdSessionIDs);
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
