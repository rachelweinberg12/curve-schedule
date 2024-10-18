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
    <div className="flex flex-col items-center">
      {account && (
        <Image
          src={account.imageUrl}
          alt={profile.Name}
          height="100"
          width="100"
          className="rounded-full sm:h-40 sm:w-40 h-28 w-28"
        />
      )}
      <h1 className="text-lg font-bold mt-3">{profile.Name}</h1>
      <p>{profile.Title}</p>
      {isUsersProfile && <em>(This is your profile)</em>}
      <div>
        <h2 className="text-lg font-bold mt-10">Hosted Sessions</h2>
        {sortedSessions.map((session) => (
          <SessionText
            key={`${session["Title"]} + ${session["Start time"]} + ${session["End time"]}`}
            session={session}
            locations={locations.filter((loc) =>
              session["Location name"].includes(loc.Name)
            )}
          />
        ))}
      </div>
    </div>
  );
}
