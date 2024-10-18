"use client";
import { GuestProfile } from "@/db/guests";
import { Session } from "@/db/sessions";
import { Location } from "@/db/locations";
import Image from "next/image";
import { SessionText } from "../schedule/session-text";
import { sortSessions } from "../schedule/day-text";
import { SimpleUser } from "@/db/auth";
import { SocialLinks } from "../people/socials";
import Link from "next/link";

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {account && (
          <Image
            src={account.imageUrl}
            alt={profile.Name}
            height="100"
            width="100"
            className="rounded-full sm:h-40 sm:w-40 h-28 w-28"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.Name}</h1>
          <p className="text-gray-600">{profile.Title}</p>
          {isUsersProfile && <em className="text-sm text-gray-500">(This is your profile)</em>}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Bio</h2>
        <p>{profile.Bio}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Social Links</h2>
        <SocialLinks profile={profile} />
      </div>
      {isUsersProfile && (
        <Link href={`/${profile.ID}/edit`} className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 mx-auto px-12 text-center">
          Edit Profile
        </Link>
      )}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Hosted Sessions</h2>
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
