import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { UserIcon, StarIcon } from "@heroicons/react/24/solid";
import { Session } from "@/db/sessions";
import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { RSVP } from "@/db/rsvps";
import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";
import { SessionModal } from "../modals";
import { useUserRecordID } from "@/utils/hooks";
import { SessionText } from "./session-text";
import { Tooltip } from "./tooltip";

export function SessionBlock(props: {
  session: Session;
  location: Location;
  allLocations: Location[];
  day: Day;
  rsvpsForEvent: RSVP[];
}) {
  const { session, location, allLocations, day, rsvpsForEvent } = props;
  const startTime = new Date(session["Start time"]).getTime();
  const endTime = new Date(session["End time"]).getTime();
  const sessionLength = endTime - startTime;
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const isBlank = !session.Title;
  const isBookable =
    !!isBlank &&
    !!location.Bookable &&
    startTime > new Date().getTime() &&
    startTime >= new Date(day["Start bookings"]).getTime() &&
    startTime < new Date(day["End bookings"]).getTime();
  const isBlocked = session.Title === "[Blocked]" && !session.Hosts;
  return isBookable ? (
    <BookableSessionCard
      session={session}
      location={location}
      numHalfHours={numHalfHours}
    />
  ) : (
    <>
      {isBlank || isBlocked ? (
        <BlankSessionCard numHalfHours={numHalfHours} />
      ) : (
        <RealSessionCard
          session={session}
          location={location}
          allLocations={allLocations}
          numHalfHours={numHalfHours}
          rsvpsForEvent={rsvpsForEvent}
        />
      )}
    </>
  );
}

export function BookableSessionCard(props: {
  location: Location;
  session: Session;
  numHalfHours: number;
}) {
  const { numHalfHours, session, location } = props;
  const dayParam = DateTime.fromISO(session["Start time"])
    .setZone("America/Los_Angeles")
    .toFormat("MM-dd");
  const timeParam = DateTime.fromISO(session["Start time"])
    .setZone("America/Los_Angeles")
    .toFormat("HH:mm");
  return (
    <div className={`row-span-${numHalfHours} my-0.5 min-h-10`}>
      <Link
        className="rounded font-roboto h-full w-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
        href={`/add-session?location=${location.Name}&time=${timeParam}&day=${dayParam}`}
      >
        <PlusIcon className="h-4 w-4 text-gray-400" />
      </Link>
    </div>
  );
}

function BlankSessionCard(props: { numHalfHours: number }) {
  const { numHalfHours } = props;
  return <div className={`row-span-${numHalfHours} my-0.5 min-h-12`} />;
}

export function RealSessionCard(props: {
  session: Session;
  numHalfHours: number;
  location: Location;
  allLocations: Location[];
  rsvpsForEvent: RSVP[];
}) {
  const { session, numHalfHours, location, allLocations, rsvpsForEvent } =
    props;
  const userRecordID = useUserRecordID();
  const [optimisticRSVPResponse, setOptimisticRSVPResponse] = useState<
    boolean | null
  >(null);
  const userIsRSVPd = rsvpsForEvent.length > 0;
  const rsvpStatus =
    optimisticRSVPResponse !== null ? optimisticRSVPResponse : userIsRSVPd;
  const isSpeaking = userRecordID && !!session.Hosts?.includes(userRecordID);
  const isFacilitating =
    userRecordID && !!session.Facilitator?.includes(userRecordID);
  const isMCing = userRecordID && !!session.MC?.includes(userRecordID);
  const isHostingAtAll = isSpeaking || isFacilitating || isMCing;
  const allDisplayedHosts = session["Facilitator name"]
    ? session["Host name"]?.concat(session["Facilitator name"])
    : session["Host name"];
  const formattedHostNames = allDisplayedHosts?.join(", ") ?? "No hosts";
  const lowerOpacity = !rsvpStatus && !isHostingAtAll;
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const changeToRSVPDisplay =
    optimisticRSVPResponse === null || userIsRSVPd === optimisticRSVPResponse
      ? 0
      : optimisticRSVPResponse
      ? 1
      : -1;
  const numRSVPs = session["Num RSVPs"] + changeToRSVPDisplay;
  return (
    <Tooltip
      content={
        isHostingAtAll ? (
          <span className="text-nowrap text-sm">
            You are{" "}
            {isSpeaking
              ? "speaking"
              : isFacilitating
              ? "facilitating"
              : "MCing"}
            .
          </span>
        ) : undefined
      }
      className={`row-span-${numHalfHours} my-0.5 overflow-hidden group`}
    >
      <SessionModal
        close={() => setSessionModalOpen(false)}
        open={sessionModalOpen}
        sessionInfoDisplay={
          <SessionText
            session={session}
            locations={allLocations.filter(
              (loc) => !!session["Location name"].includes(loc.Name)
            )}
            userIsRSVPd={rsvpsForEvent.length > 0}
            optimisticRSVPResponse={optimisticRSVPResponse}
            setOptimisticRSVPResponse={setOptimisticRSVPResponse}
          />
        }
      />
      <button
        className={clsx(
          "py-1 px-1 rounded font-roboto h-full min-h-10 cursor-pointer flex flex-col relative w-full",
          `bg-${location.Color}-700 border-2 border-${location.Color}-800`,
          lowerOpacity && "bg-opacity-40"
        )}
        onClick={() => setSessionModalOpen(true)}
      >
        <p
          className={clsx(
            "font-medium text-xs leading-[1.15] text-left",
            numHalfHours > 1 ? "line-clamp-3" : "line-clamp-1"
          )}
        >
          {session.Title}
        </p>
        <p
          className={clsx(
            "text-[10px] leading-tight text-left ",
            numHalfHours > 2
              ? "line-clamp-3"
              : numHalfHours > 1
              ? "line-clamp-2"
              : "line-clamp-1"
          )}
        >
          {formattedHostNames}
        </p>
        {session.Capacity && (
          <div
            className={clsx(
              "absolute py-[1px] px-1 rounded-tl text-[10px] bottom-0 right-0 flex gap-0.5 items-center",
              `bg-${location.Color}-800`,
              lowerOpacity && "bg-opacity-50"
            )}
          >
            <UserIcon className="h-.5 w-2.5" />
            {numRSVPs}/{session.Capacity}
          </div>
        )}
        {isHostingAtAll && (
          <div
            className={clsx(
              "absolute pl-0.5 pb-0.5 rounded-bl top-0 text-sm right-0 flex gap-0.5 items-center",
              `bg-${location.Color}-800`,
              lowerOpacity && "bg-opacity-50"
            )}
          >
            <StarIcon className="h-3 w-3" />
          </div>
        )}
      </button>
    </Tooltip>
  );
}
