import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { base } from "@/db/db";
import { getUserRecordID } from "@/db/auth";
import { getSession, getSessions, validateSession } from "@/db/sessions";
import { BasicGuest } from "@/db/guests";
import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { DateTime } from "luxon";

type SessionParams = {
  recordID: string;
  title: string;
  description: string;
  hosts: BasicGuest[];
  location: Location;
  day: Day;
  startTimeString: string;
  duration: number;
};
type SessionUpdate = {
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts: string[];
  Location: string[];
};

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      recordID,
      title,
      description,
      hosts,
      location,
      day,
      startTimeString,
      duration,
    } = (await request.json()) as SessionParams;
    const userRecordID = await getUserRecordID();
    const existingSession = await getSession(recordID);

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!existingSession.Hosts?.includes(userRecordID)) {
      return NextResponse.json(
        { error: "Not authorized to edit this session" },
        { status: 403 }
      );
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
    const session: SessionUpdate = {
      Title: title,
      Description: description,
      Hosts: hostIDs,
      Location: [location.ID],
      "Start time": startTimeStamp.toISOString(),
      "End time": new Date(
        startTimeStamp.getTime() + duration * 60 * 1000
      ).toISOString(),
    };
    console.log(session);
    const existingSessions = await getSessions();
    const otherExistingSessions = existingSessions.filter(
      (sess) => sess.ID !== recordID
    );
    const sessionValid = validateSession(session, otherExistingSessions);
    console.log("sessionValid", sessionValid);
    if (!sessionValid) {
      return NextResponse.json(
        { error: "Session is not valid" },
        { status: 400 }
      );
    }

    await base("Sessions").update([
      {
        id: recordID,
        fields: session,
      },
    ]);

    return NextResponse.json({ message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
