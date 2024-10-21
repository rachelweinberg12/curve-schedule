"use client";
import { DateTime } from "luxon";
import { Session } from "@/db/sessions";
import { Location } from "@/db/locations";
import { PersonLink, ColoredTag } from "../tags";
import { RSVP } from "@/db/rsvps";
import { useUserRecordID } from "@/utils/hooks";
import { useState } from "react";
import { rsvp, RSVPButton } from "../rsvp-button";

export function SessionText(props: {
  session: Session;
  locations: Location[];
  rsvpsForEvent?: RSVP[];
}) {
  const { session, locations, rsvpsForEvent } = props;
  const userRecordID = useUserRecordID();
  const [optimisticRSVPResponse, setOptimisticRSVPResponse] = useState<
    boolean | null
  >(null);
  const rsvpStatus =
    optimisticRSVPResponse !== null
      ? optimisticRSVPResponse
      : !!rsvpsForEvent && rsvpsForEvent.length > 0;
  const hostStatus = userRecordID
    ? !!session.Hosts?.includes(userRecordID)
    : false;
  return (
    <div className="px-1.5 rounded h-full min-h-10 pt-4 pb-6">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="font-bold leading-tight">{session.Title}</h1>
          <div className="flex items-center gap-1">
            {locations.map((loc) => (
              <ColoredTag key={loc.Name} color={loc.Color} text={loc.Name} />
            ))}
          </div>
        </div>
        {rsvpsForEvent && !hostStatus && (
          <RSVPButton
            rsvp={() => {
              if (!userRecordID) return;
              rsvp(session.ID, !!rsvpStatus);
              setOptimisticRSVPResponse(!rsvpStatus);
            }}
            rsvpd={rsvpStatus}
          />
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2 sm:items-center gap-2">
        <div className="flex gap-3 text-xs text-gray-400 items-center">
          <div className="flex gap-2">
            {session.Hosts?.map((host, idx) => {
              return session["Host name"] ? (
                <PersonLink key={host} name={session["Host name"][idx]} />
              ) : undefined;
            })}
          </div>
          <div className="flex gap-1">
            <span>
              {DateTime.fromISO(session["Start time"]).toFormat("EEEE")},{" "}
              {DateTime.fromISO(session["Start time"])
                .setZone("America/Los_Angeles")
                .toFormat("h:mm a")}{" "}
              -{" "}
              {DateTime.fromISO(session["End time"])
                .setZone("America/Los_Angeles")
                .toFormat("h:mm a")}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm whitespace-pre-line mt-2">{session.Description}</p>
    </div>
  );
}
