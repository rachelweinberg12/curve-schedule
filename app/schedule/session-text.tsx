"use client";
import { DateTime } from "luxon";
import { Session } from "@/db/sessions";
import { Location } from "@/db/locations";
import { PersonLink, ColoredTag } from "@/components/tags";
import { useUserMetadata } from "@/utils/hooks";
import { useState } from "react";
import { rsvp, RSVPButton } from "@/components/rsvp-button";
import { Markdown } from "@/components/markdown";
import Link from "next/link";
import clsx from "clsx";
import { Tooltip } from "./tooltip";

export function SessionText(props: {
  session: Session;
  locations: Location[];
  userIsRSVPd?: boolean;
  optimisticRSVPResponse?: boolean | null;
  setOptimisticRSVPResponse?: (response: boolean | null) => void;
}) {
  const {
    session,
    locations,
    userIsRSVPd,
    optimisticRSVPResponse,
    setOptimisticRSVPResponse,
  } = props;
  const userMetadata = useUserMetadata();
  const { record_id: userRecordID, volunteer: isUserVolunteer } =
    userMetadata ?? {};
  const [localOptRSVPResponse, setLocalOptRSVPResponse] = useState<
    boolean | null
  >(null);
  const realOptRSVPResponse =
    optimisticRSVPResponse !== undefined
      ? optimisticRSVPResponse
      : localOptRSVPResponse;
  const setRealOptRSVPResponse =
    setOptimisticRSVPResponse !== undefined
      ? setOptimisticRSVPResponse
      : setLocalOptRSVPResponse;
  const rsvpStatus =
    realOptRSVPResponse !== null ? realOptRSVPResponse : !!userIsRSVPd;
  const isSpeaking = userRecordID && !!session.Hosts?.includes(userRecordID);
  const isFacilitating =
    userRecordID && !!session.Facilitator?.includes(userRecordID);
  const isMCing = userRecordID && !!session.MC?.includes(userRecordID);
  const isHostingAtAll = isSpeaking || isFacilitating || isMCing;
  const changeToRSVPDisplay =
    realOptRSVPResponse === null || userIsRSVPd === realOptRSVPResponse
      ? 0
      : realOptRSVPResponse
      ? 1
      : -1;
  const numRSVPs = session["Num RSVPs"] + changeToRSVPDisplay;
  const spotsLeft = !!session.Capacity ? session.Capacity - numRSVPs : 0;
  const isAtCapacity = !!session.Capacity && spotsLeft <= 0;
  const isNearCapacity = !!session.Capacity && spotsLeft <= 5;
  return (
    <div className="px-1.5 h-full min-h-10 py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-end gap-1">
          <h1 className="font-bold leading-tight">{session.Title}</h1>
          {isHostingAtAll && (
            <span className="text-sm text-gray-400 italic">
              (
              {isSpeaking
                ? "speaking"
                : isFacilitating
                ? "facilitating"
                : "MCing"}
              )
            </span>
          )}
        </div>
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
      <span className="text-xs text-gray-400">
        {DateTime.fromISO(session["Start time"])
          .setZone("America/Los_Angeles")
          .toFormat("EEEE")}
        ,{" "}
        {DateTime.fromISO(session["Start time"])
          .setZone("America/Los_Angeles")
          .toFormat("h:mm a")}{" "}
        -{" "}
        {DateTime.fromISO(session["End time"])
          .setZone("America/Los_Angeles")
          .toFormat("h:mm a")}
      </span>
      <Markdown
        className="text-sm whitespace-pre-line mt-2"
        text={session.Description}
      />
      <div className="flex justify-between mt-1 gap-4 text-xs text-gray-400 items-center">
        <div>
          {session.Capacity && (
            <span
              className={clsx(
                isAtCapacity
                  ? "text-rose-500 bg-rose-500"
                  : isNearCapacity
                  ? "text-amber-500 bg-amber-500"
                  : "hidden",
                "px-1.5 py-0.5 rounded-sm bg-opacity-10"
              )}
            >
              {numRSVPs} of {session.Capacity} spots filled.{" "}
              {Math.max(session.Capacity - numRSVPs, 0)} spots left.
            </span>
          )}
        </div>
        {userIsRSVPd !== undefined && !isHostingAtAll && !isUserVolunteer && (
          <Tooltip
            content={
              isAtCapacity && !rsvpStatus ? (
                <span>This session is full.</span>
              ) : undefined
            }
          >
            <RSVPButton
              rsvp={() => {
                if (!userRecordID) return;
                rsvp(session.ID, !!rsvpStatus);
                setRealOptRSVPResponse(!rsvpStatus);
              }}
              rsvpd={rsvpStatus}
              disabled={isAtCapacity && !rsvpStatus}
            />
          </Tooltip>
        )}
        {isSpeaking && (
          <Link
            href={`/edit-session/${session.ID}`}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
            title="Edit session"
          >
            edit
          </Link>
        )}
      </div>
    </div>
  );
}
