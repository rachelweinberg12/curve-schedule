"use client";
import { GuestProfile } from "@/db/guests";
import { Session } from "@/db/sessions";
import { Location } from "@/db/locations";
import Image from "next/image";
import { SessionText } from "../schedule/session-text";
import { sortSessions } from "../schedule/day-text";
import { SimpleUser } from "@/db/auth";

export function ProfilePage(props: {
  profile: GuestProfile;
  sessionsHosting: Session[];
  locations: Location[];
  account?: SimpleUser;
  isUsersProfile: boolean;
}) {
  const { profile, sessionsHosting, locations, account, isUsersProfile } =
    props;
  const sortedSessions = sortSessions(sessionsHosting, locations);
  return (
    <div>
      {account && (
        <Image
          src={account.imageUrl}
          alt={profile.Name}
          height="100"
          width="100"
          className="rounded-full"
        />
      )}
      <h1>{profile.Name}</h1>
      <p>{profile.Bio}</p>
      {isUsersProfile && <p>This is your profile</p>}
      <h2 className="text-lg font-bold">Hosted Sessions</h2>
      <>
        {sortedSessions.map((session) => (
          <SessionText
            key={`${session["Title"]} + ${session["Start time"]} + ${session["End time"]}`}
            session={session}
            locations={locations.filter((loc) =>
              session["Location name"].includes(loc.Name)
            )}
          />
        ))}
      </>
    </div>
  );
}
