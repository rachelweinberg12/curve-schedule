import { Day } from "@/db/days";
import { Session } from "@/db/sessions";
import { DateTime } from "luxon";

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export const convertParamDateTime = (date: string, time: string) => {
  return new Date(`2024-${date}T${time}:00-08:00`);
};

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= new Date(day.Start).getTime() &&
    date.getTime() <= new Date(day.End).getTime()
  );
};

export function checkStringForSearch(search: string, string: string) {
  return string.toLowerCase().includes(search.toLowerCase());
}

export function generateSlug(name: string): string {
  // Remove all spaces and apostrophes
  return name.replaceAll(" ", "").replaceAll("'", "");
}

export function getDurationFromSession(session: Session) {
  const start = new Date(session["Start time"]);
  const end = new Date(session["End time"]);
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

export type StartTime = {
  formattedTime: string;
  time: number;
  maxDuration: number;
  available: boolean;
};
export function getAvailableStartTimes(
  day: Day,
  sessions: Session[],
  location?: string,
  session?: Session
) {
  const locationSelected = !!location;
  const sessionsExcludingCurrent = session
    ? sessions.filter((sess) => sess.ID !== session.ID)
    : sessions;
  const filteredSessions = locationSelected
    ? sessionsExcludingCurrent.filter((s) => s["Location name"][0] === location)
    : sessionsExcludingCurrent;

  const sortedSessions = filteredSessions.sort(
    (a, b) =>
      new Date(a["Start time"]).getTime() - new Date(b["Start time"]).getTime()
  );
  const generalMaxDuration = session
    ? Math.max(getDurationFromSession(session), 120)
    : 120;
  const startTimes: StartTime[] = [];
  const startBookings = session
    ? Math.min(
        new Date(session["Start time"]).getTime(),
        new Date(day["Start bookings"]).getTime()
      )
    : new Date(day["Start bookings"]).getTime();
  const endBookings = session
    ? Math.max(
        new Date(session["End time"]).getTime(),
        new Date(day["End bookings"]).getTime()
      )
    : new Date(day["End bookings"]).getTime();
  for (let t = startBookings; t < endBookings; t += 30 * 60 * 1000) {
    const formattedTime = DateTime.fromMillis(t)
      .setZone("America/Los_Angeles")
      .toFormat("h:mm a");
    if (locationSelected) {
      const sessionNow = sortedSessions.find(
        (session) =>
          new Date(session["Start time"]).getTime() <= t &&
          new Date(session["End time"]).getTime() > t
      );
      if (!!sessionNow) {
        startTimes.push({
          formattedTime,
          time: t,
          maxDuration: 0,
          available: false,
        });
      } else {
        const nextSession = sortedSessions.find(
          (session) => new Date(session["Start time"]).getTime() > t
        );
        const latestEndTime = nextSession
          ? new Date(nextSession["Start time"]).getTime()
          : new Date(day["End bookings"]).getTime();
        startTimes.push({
          formattedTime,
          time: t,
          maxDuration: (latestEndTime - t) / 1000 / 60,
          available: true,
        });
      }
    } else {
      startTimes.push({
        formattedTime,
        time: t,
        maxDuration: generalMaxDuration,
        available: true,
      });
    }
  }
  return startTimes;
}
