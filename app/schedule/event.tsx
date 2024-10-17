"use client";
import { ScheduleSettings } from "./schedule-settings";
import { DayGrid } from "./day-grid";
import { useSearchParams } from "next/navigation";
import { DayText } from "./day-text";
import { Input } from "./input";
import { useState } from "react";
import { Day } from "@/db/days";
import { Event } from "@/db/events";
import { BasicGuest } from "@/db/guests";
import { Location } from "@/db/locations";
import { RSVP } from "@/db/rsvps";
import { CONSTS } from "@/utils/constants";

export function EventDisplay(props: {
  event: Event;
  days: Day[];
  locations: Location[];
  guests: BasicGuest[];
  rsvps: RSVP[];
}) {
  const { event, days, locations, guests, rsvps } = props;
  const daysForEvent = days.filter(
    (day) =>
      !CONSTS.MULTIPLE_EVENTS ||
      (day["Event name"] && day["Event name"][0] === event.Name)
  );
  const locationsForEvent = locations.filter(
    (loc) =>
      !CONSTS.MULTIPLE_EVENTS ||
      (event["Location names"] && event["Location names"].includes(loc.Name))
  );
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "grid";
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="sm:text-4xl text-3xl font-bold">Schedule</h1>
      <div className="mb-10 mt-5 w-full">
        <ScheduleSettings />
      </div>
      {view !== "grid" && (
        <Input
          className="max-w-3xl w-full mb-5 mx-auto"
          placeholder="Search sessions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}
      <div className="flex flex-col gap-12 w-full">
        {daysForEvent.map((day) => (
          <div key={day.Start}>
            {view === "grid" ? (
              <DayGrid
                day={day}
                locations={locationsForEvent}
                rsvps={rsvps}
                eventName={event.Name}
              />
            ) : (
              <DayText
                day={day}
                search={search}
                locations={locationsForEvent}
                rsvps={view === "rsvp" ? rsvps : []}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
