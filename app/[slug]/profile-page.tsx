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
import { PencilIcon } from "@heroicons/react/24/outline";
import { ColoredTag, TypeTagColor } from "../tags";
import { generateSlug } from "@/utils/utils";
import { Markdown } from "../markdown";

export function ProfilePage(props: {
  profile: GuestProfile;
  sessionsHosting: Session[];
  locations: Location[];
  account?: SimpleUser;
  isUsersProfile: boolean;
  rsvpdSessions: Session[];
}) {
  const {
    profile,
    sessionsHosting,
    locations,
    account,
    isUsersProfile,
    rsvpdSessions,
  } = props;
  const sortedHostingSessions = sortSessions(sessionsHosting, locations);
  const sortedRSVPSessions = sortSessions(rsvpdSessions, locations);
  const userSlug = generateSlug(profile.Name);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {account && (
            <Image
              src={account.imageUrl}
              alt={profile.Name}
              height="100"
              width="100"
              className="rounded-full sm:h-28 sm:w-28 h-16 w-16 object-cover"
            />
          )}
          <div>
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl font-bold">{profile.Name}</h1>{" "}
              {profile.Type !== "Attendee" &&
                profile.Type !== "Facilitator" && (
                  <ColoredTag
                    text={profile.Type}
                    color={TypeTagColor[profile.Type]}
                  />
                )}
            </div>
            <p className="text-gray-400 mb-3">{profile.Title}</p>
            <SocialLinks profile={profile} />
          </div>
        </div>
        {isUsersProfile && (
          <Link
            href={`/${userSlug}/edit`}
            className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <PencilIcon className="h-5 w-5 stroke-2" />
          </Link>
        )}
      </div>
      {(profile.Bio || profile["Exp topics"] || profile["Curious topics"]) && (
        <div>
          <hr className="border-gray-700 my-6" />
          {profile.Bio && (
            <div className="my-2">
              <h2 className="font-bold">Bio</h2>
              <Markdown className="pl-2" text={profile.Bio} />
            </div>
          )}
          {profile["Exp topics"] && (
            <div className="my-2">
              <h2 className="font-bold">
                What topics are you well-versed in and opinionated on?
              </h2>
              <Markdown className="pl-2" text={profile["Exp topics"]} />
            </div>
          )}
          {profile["Curious topics"] && (
            <div className="my-2">
              <h2 className="font-bold">
                What topics are you confused, uncertain, or curious about?
              </h2>
              <Markdown className="pl-2" text={profile["Curious topics"]} />
            </div>
          )}
        </div>
      )}
      {sessionsHosting.length > 0 && (
        <div>
          <hr className="border-gray-700 my-6" />
          <h2 className="text-lg font-bold">Hosted Sessions</h2>
          <div className="flex flex-col gap-1">
            {sortedHostingSessions.map((session) => (
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
      )}
      {rsvpdSessions.length > 0 && (
        <div>
          <hr className="border-gray-700 my-6" />
          <h2 className="text-lg font-bold">RSVP&apos;d Sessions</h2>
          <div className="flex flex-col gap-1">
            {sortedRSVPSessions.map((session) => (
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
      )}
    </div>
  );
}
