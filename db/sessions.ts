import { base } from "./db";
import { CONSTS } from "@/utils/constants";

export type Session = {
  ID: string;
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts?: string[];
  "Host name"?: string[];
  "Host email"?: string;
  Location: string[];
  "Location name": string[];
  Capacity: number;
  "Num RSVPs": number;
};
export async function getSessions() {
  const sessions: Session[] = [];
  await base("Sessions")
    .select({
      fields: [
        "Title",
        "Description",
        "Start time",
        "End time",
        "Hosts",
        "Host name",
        "Host email",
        "Location",
        "Location name",
        "Capacity",
        "Num RSVPs",
      ],
      filterByFormula: `AND({Start time}, {End time}, {Location})`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return sessions;
}

export async function getSessionsByEvent(eventName: string) {
  const sessions: Session[] = [];
  const isScheduledFilter = "AND({Start time}, {End time}, {Location})";
  const filterFormula = CONSTS.MULTIPLE_EVENTS
    ? `AND({Event name} = "${eventName}", ${isScheduledFilter})`
    : isScheduledFilter;
  await base("Sessions")
    .select({
      fields: [
        "Title",
        "Description",
        "Start time",
        "End time",
        "Hosts",
        "Host name",
        "Host email",
        "Location",
        "Location name",
        "Capacity",
        "Num RSVPs",
      ],
      filterByFormula: filterFormula,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return sessions;
}

export async function getSessionsByHost(hostName: string) {
  const sessions: Session[] = [];
  await base("Sessions")
    .select({
      fields: [
        "Title",
        "Description",
        "Start time",
        "End time",
        "Hosts",
        "Host name",
        "Host email",
        "Location",
        "Location name",
        "Capacity",
        "Num RSVPs",
      ],
      filterByFormula: `SEARCH("${hostName}", {Hosts}) != 0`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return sessions;
}

export async function getSessionsByIDs(sessionIDs: string[]) {
  const sessions: Session[] = [];
  const sessionIDsString = sessionIDs.map((id) => `${id}`).join(", ");
  console.log(sessionIDsString);
  await base("Sessions")
    .select({
      fields: [
        "Title",
        "Description",
        "Start time",
        "End time",
        "Hosts",
        "Host name",
        "Host email",
        "Location",
        "Location name",
        "Capacity",
        "Num RSVPs",
      ],
      filterByFormula: `FIND({ID}, "${sessionIDsString}") > 0`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return sessions;
}
