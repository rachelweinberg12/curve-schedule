"use client";
import { useSearchParams } from "next/navigation";
import { SessionText } from "./session-text";
import { DateTime } from "luxon";
import { Day } from "@/db/days";
import { RSVP } from "@/db/rsvps";
import { Location } from "@/db/locations";
import { Session } from "@/db/sessions";
import { checkStringForSearch } from "@/utils/utils";
import { useUserRecordID } from "@/utils/hooks";

export function DayText(props: {
  locations: Location[];
  day: Day;
  search: string;
  rsvps: RSVP[];
  filterByRSVP?: boolean;
}) {
  const { day, locations, search, rsvps, filterByRSVP } = props;
  const searchParams = useSearchParams();
  const userRecordID = useUserRecordID();
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.Name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const includedSessions = day.Sessions.filter((session) => {
    return (
      includedLocations.some((location) =>
        session["Location name"].includes(location.Name)
      ) &&
      sessionMatchesSearch(session, search) &&
      session.Title !== "[Blocked]"
    );
  });
  let sessions = sortSessions(includedSessions, locations);

  // If RSVPs are present, only show sessions that the user has RSVP'd to
  if (filterByRSVP) {
    const rsvpSet = new Set(rsvps.map((rsvp) => rsvp.Session[0]));
    sessions = sessions.filter(
      (session) =>
        rsvpSet.has(session.ID) ||
        (userRecordID && session.Hosts?.includes(userRecordID))
    );
  }
  return (
    <div className="flex flex-col max-w-3xl">
      <h2 className="text-2xl font-bold w-full text-left">
        {DateTime.fromISO(day.Start)
          .setZone("America/Los_Angeles")
          .toFormat("EEEE, MMMM d")}{" "}
      </h2>
      <div className="flex flex-col divide-y divide-gray-700">
        {sessions.length > 0 ? (
          <>
            {sessions.map((session) => {
              const rsvpsForEvent = rsvps.filter(
                (rsvp) => rsvp.Session[0] === session.ID
              );
              console.log(rsvps.length, rsvpsForEvent);
              return (
                <SessionText
                  key={`${session["Title"]} + ${session["Start time"]} + ${session["End time"]}`}
                  session={session}
                  locations={locations.filter((loc) =>
                    session["Location name"].includes(loc.Name)
                  )}
                  numRSVPs={session["Num RSVPs"]}
                  rsvpsForEvent={rsvpsForEvent}
                />
              );
            })}
          </>
        ) : (
          <p className="text-gray-400 italic text-sm w-full text-left">
            No sessions
          </p>
        )}
      </div>
    </div>
  );
}

function sessionMatchesSearch(session: Session, search: string) {
  return (
    checkStringForSearch(search, session.Title ?? "") ||
    checkStringForSearch(search, session.Description ?? "") ||
    checkStringForSearch(
      search,
      (session["Host name"] ?? []).join(" ") ?? ""
    ) ||
    checkStringForSearch(search, session["Location name"].join(" ") ?? "")
  );
}

export function sortSessions(sessions: Session[], locations: Location[]) {
  const sortedByLocation = sessions.sort((a, b) => {
    return (
      (locations.find((loc) => loc.Name === a["Location name"][0])?.Index ??
        0) -
      (locations.find((loc) => loc.Name === b["Location name"][0])?.Index ?? 0)
    );
  });
  const sortedByTime = sortedByLocation.sort((a, b) => {
    return (
      new Date(a["Start time"]).getTime() - new Date(b["Start time"]).getTime()
    );
  });
  return sortedByTime;
}
