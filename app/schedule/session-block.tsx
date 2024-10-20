import clsx from "clsx";
import { ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { Session } from "@/db/sessions";
import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { RSVP } from "@/db/rsvps";
import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";
import { SessionModal } from "../modals";
import { useUserRecordID } from "@/utils/hooks";
import { PersonLink } from "../tags";
import { rsvp } from "../rsvp-button";

export function SessionBlock(props: {
  session: Session;
  location: Location;
  day: Day;
  rsvpsForEvent: RSVP[];
}) {
  const { session, location, day, rsvpsForEvent } = props;
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
  return isBookable ? (
    <BookableSessionCard
      session={session}
      location={location}
      numHalfHours={numHalfHours}
    />
  ) : (
    <>
      {isBlank ? (
        <BlankSessionCard numHalfHours={numHalfHours} />
      ) : (
        <RealSessionCard
          session={session}
          location={location}
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
  rsvpsForEvent: RSVP[];
}) {
  const { session, numHalfHours, location, rsvpsForEvent } = props;
  const userRecordID = useUserRecordID();
  const [optimisticRSVPResponse, setOptimisticRSVPResponse] = useState<
    boolean | null
  >(null);
  const rsvpStatus =
    optimisticRSVPResponse !== null
      ? optimisticRSVPResponse
      : rsvpsForEvent.length > 0;
  const hostStatus = userRecordID
    ? !!session.Hosts?.includes(userRecordID)
    : false;
  const formattedHostNames = session["Host name"]?.join(", ") ?? "No hosts";
  const lowerOpacity = !rsvpStatus && !hostStatus;
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const numRSVPs = session["Num RSVPs"] + (optimisticRSVPResponse ? 1 : 0);
  const SessionInfoDisplay = () => (
    <>
      <h1 className="text-lg font-bold leading-tight">{session.Title}</h1>
      <div className="text-xs text-gray-500 mb-2 mt-1 flex gap-2">
        {session.Hosts?.map((host, idx) => {
          return session["Host name"] ? (
            <PersonLink key={host} name={session["Host name"][idx]} />
          ) : undefined;
        })}
      </div>
      <p className="text-sm whitespace-pre-line">{session.Description}</p>
      <div className="flex justify-between mt-2 gap-4 text-xs text-gray-500">
        <div className="flex gap-1">
          <UserIcon className="h-4 w-4" />
          <span>
            {numRSVPs} RSVPs (max capacity {session.Capacity})
          </span>
        </div>
        <div className="flex gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>
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
    </>
  );
  return (
    <div className={`row-span-${numHalfHours} my-0.5 overflow-hidden group`}>
      <SessionModal
        close={() => setSessionModalOpen(false)}
        open={sessionModalOpen}
        // rsvp here should actually be rsvp
        rsvp={() => {
          if (!userRecordID) return;
          rsvp(session.ID, !!rsvpStatus);
          setOptimisticRSVPResponse(!rsvpStatus);
        }}
        rsvpd={rsvpStatus}
        hosting={hostStatus}
        sessionInfoDisplay={<SessionInfoDisplay />}
      />
      <button
        className={clsx(
          "py-1 px-1 rounded font-roboto h-full min-h-10 cursor-pointer flex flex-col relative w-full",
          `bg-${location.Color}-700 border-2 border-${location.Color}-800`,
          lowerOpacity && "bg-opacity-40 border-opacity-50"
        )}
        onClick={() => setSessionModalOpen(true)}
      >
        <p
          className={clsx(
            "font-medium text-xs leading-[1.15] text-left",
            numHalfHours > 1 ? "line-clamp-2" : "line-clamp-1"
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
        <div
          className={clsx(
            "absolute py-[1px] px-1 rounded-tl text-[10px] bottom-0 right-0 flex gap-0.5 items-center",
            `bg-${location.Color}-800`,
            lowerOpacity && "bg-opacity-50"
          )}
        >
          <UserIcon className="h-.5 w-2.5" />
          {numRSVPs}
        </div>
      </button>
    </div>
  );
}
