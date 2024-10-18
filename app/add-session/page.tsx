import { getEventByName } from "@/db/events";
import { AddSessionForm } from "./add-session-form";
import { Suspense } from "react";
import { getDaysByEvent } from "@/db/days";
import { getSessionsByEvent } from "@/db/sessions";
import { getGuestsByEvent } from "@/db/guests";
import { getBookableLocations } from "@/db/locations";
import { CONSTS } from "@/utils/constants";

export default async function AddSession() {
  const [event, days, sessions, guests, locations] = await Promise.all([
    getEventByName(CONSTS.TITLE),
    getDaysByEvent(CONSTS.TITLE),
    getSessionsByEvent(CONSTS.TITLE),
    getGuestsByEvent(CONSTS.TITLE),
    getBookableLocations(),
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
  const filteredLocations = locations.filter(
    (location) =>
      location.Bookable &&
      (!CONSTS.MULTIPLE_EVENTS ||
        (event["Location names"] &&
          event["Location names"].includes(location.Name)))
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-2xl mx-auto pb-24">
        <AddSessionForm
          days={days}
          locations={filteredLocations}
          sessions={sessions}
          guests={guests}
        />
      </div>
    </Suspense>
  );
}
