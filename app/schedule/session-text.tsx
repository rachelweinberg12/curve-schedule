"use client";
import { DateTime } from "luxon";
import { Session } from "@/db/sessions";
import { Location } from "@/db/locations";
import { PersonLink, ColoredTag } from "../tags";
import { RSVP } from "@/db/rsvps";
import { useUserMetadata } from "@/utils/hooks";
import { useState } from "react";
import { rsvp, RSVPButton } from "../rsvp-button";
import { Markdown } from "../markdown";

export function SessionText(props: {
  session: Session;
  locations: Location[];
  rsvpsForEvent?: RSVP[];
}) {
  const { session, locations, rsvpsForEvent } = props;
  const userMetadata = useUserMetadata();
  const { record_id: userRecordID, volunteer: isUserVolunteer } =
    userMetadata ?? {};
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
    <div className="px-1.5 h-full min-h-10 pt-4 pb-6">
      <div className="flex justify-between items-start">
        <h1 className="font-bold leading-tight">{session.Title}</h1>
        <div className="flex items-center gap-1">
          {locations.map((loc) => (
            <ColoredTag key={loc.Name} color={loc.Color} text={loc.Name} />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2 sm:items-center gap-2">
        <div className="flex gap-1 text-xs text-gray-400 items-center">
          <div className="flex gap-2">
            {session.Hosts?.map((host, idx) => {
              return session["Host name"] ? (
                <PersonLink key={host} name={session["Host name"][idx]} />
              ) : undefined;
            })}
          </div>
        </div>
      </div>
      <Markdown
        className="text-sm whitespace-pre-line mt-2"
        text={session.Description}
      />
      <div className="flex justify-between mt-2 gap-4 text-xs text-gray-500">
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
        {rsvpsForEvent && !hostStatus && !isUserVolunteer && (
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
    </div>
  );
}
