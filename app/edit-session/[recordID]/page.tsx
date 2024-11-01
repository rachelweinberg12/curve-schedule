import { getSession, getSessionsByEvent } from "@/db/sessions";
import { getUserRecordID } from "@/db/auth";
import { EditSessionForm } from "./edit-session-form";
import { redirect } from "next/navigation";
import { getEventByName } from "@/db/events";
import { CONSTS } from "@/utils/constants";
import { getDaysByEvent } from "@/db/days";
import { getGuestsByEvent } from "@/db/guests";
import { getLocations } from "@/db/locations";

export default async function EditSession({
  params,
}: {
  params: { recordID: string };
}) {
  const userRecordID = await getUserRecordID();
  const session = await getSession(params.recordID);

  if (!session) {
    redirect("/");
  }

  const isHost = session.Hosts?.includes(userRecordID);

  if (!isHost) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Not Authorized</h1>
        <p>You must be a host of this session to edit it.</p>
      </div>
    );
  }

  const [event, days, sessions, guests, locations] = await Promise.all([
    getEventByName(CONSTS.TITLE),
    getDaysByEvent(CONSTS.TITLE),
    getSessionsByEvent(CONSTS.TITLE),
    getGuestsByEvent(CONSTS.TITLE),
    getLocations(),
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
      (location.Bookable || location.Name === session["Location name"][0]) &&
      (!CONSTS.MULTIPLE_EVENTS ||
        (event["Location names"] &&
          event["Location names"].includes(location.Name)))
  );

  return (
    <div className="p-4">
      <EditSessionForm
        session={session}
        sessions={sessions}
        days={days}
        locations={filteredLocations}
        guests={guests}
      />
    </div>
  );
}
