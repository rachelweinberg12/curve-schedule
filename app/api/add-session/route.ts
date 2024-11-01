import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { BasicGuest } from "@/db/guests";
import {
  Session,
  SessionInsert,
  getSessions,
  validateSession,
} from "@/db/sessions";
import { DateTime } from "luxon";
import { CONSTS } from "@/utils/constants";
import { base } from "@/db/db";
import { getUserRecordID } from "@/db/auth";

type SessionParams = {
  title: string;
  description: string;
  hosts: BasicGuest[];
  location: Location;
  day: Day;
  startTimeString: string;
  duration: number;
};

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const {
    title,
    description,
    hosts,
    location,
    day,
    startTimeString,
    duration,
  } = (await req.json()) as SessionParams;
  const userRecordID = await getUserRecordID();
  if (!userRecordID) {
    return Response.error();
  }
  const hostIDs = hosts.map((host) => host.ID);
  hostIDs.push(userRecordID);
  const dayStartDT = DateTime.fromJSDate(new Date(day.Start));
  const dayISOFormatted = dayStartDT.toFormat("yyyy-MM-dd");
  const [rawHour, rawMinute, ampm] = startTimeString.split(/[: ]/);
  const hourNum = parseInt(rawHour);
  const hour24Num = ampm === "PM" && hourNum !== 12 ? hourNum + 12 : hourNum;
  const hourStr = hour24Num < 10 ? `0${hour24Num}` : hour24Num.toString();
  const minuteNum = parseInt(rawMinute);
  const minuteStr = minuteNum < 10 ? `0${minuteNum}` : rawMinute;
  const startTimeStamp = new Date(
    `${dayISOFormatted}T${hourStr}:${minuteStr}:00-08:00`
  );
  const session: SessionInsert = {
    Title: title,
    Description: description,
    Hosts: hostIDs,
    Location: [location.ID],
    "Start time": startTimeStamp.toISOString(),
    "End time": new Date(
      startTimeStamp.getTime() + duration * 60 * 1000
    ).toISOString(),
    "Attendee scheduled": true,
  };
  if (CONSTS.MULTIPLE_EVENTS && day["Event"]) {
    session.Event = [day["Event"][0]];
  }
  console.log(session);
  const existingSessions = await getSessions();
  const sessionValid = validateSession(session, existingSessions);
  if (sessionValid) {
    await base("Sessions").create(
      [
        {
          fields: session,
        },
      ],
      function (err: string, records: any) {
        if (err) {
          console.error(err);
          return Response.error();
        }
        records.forEach(function (record: any) {
          console.log(record.getId());
        });
      }
    );
    return Response.json({ success: true });
  } else {
    return Response.error();
  }
}
