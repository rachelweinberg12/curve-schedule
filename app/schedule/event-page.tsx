import { EventDisplay } from "./event";
import { Suspense } from "react";
import { getDaysByEvent } from "@/db/days";
import { getSessionsByEvent } from "@/db/sessions";
import { getLocations } from "@/db/locations";
import { getRSVPsByUser } from "@/db/rsvps";
import { Event } from "@/db/events";
import { getUserRecordID } from "@/db/auth";

export default async function EventPage(props: { event: Event }) {
  const { event } = props;
  const userID = getUserRecordID();
  const [days, sessions, locations, rsvps] = await Promise.all([
    getDaysByEvent(event.Name),
    getSessionsByEvent(event.Name),
    getLocations(),
    getRSVPsByUser(userID),
  ]);
  days.forEach((day) => {
    const dayStartMillis = new Date(day.Start).getTime();
    const dayEndMillis = new Date(day.End).getTime();
    day.Sessions = sessions.filter((s) => {
      const sessionStartMillis = new Date(s["Start time"]).getTime();
      const sessionEndMillis = new Date(s["End time"]).getTime();
      return (
        dayStartMillis <= sessionStartMillis && dayEndMillis >= sessionEndMillis
      );
    });
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventDisplay
        event={event}
        days={days}
        locations={locations}
        rsvps={rsvps}
      />
    </Suspense>
  );
}
