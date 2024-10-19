import { CONSTS } from "@/utils/constants";
import { base } from "./db";

export type Event = {
  Name: string;
  Description: string;
  Website: string;
  Guests?: string[];
  Start: string;
  End: string;
  "Location names"?: string[];
};

const eventFields = ["Name", "Description", "Website", "Start", "End"];

const fieldsIfMultipleEvents = ["Guests", "Location names"];

export async function getEvents() {
  const events: Event[] = [];
  console.log("Getting events");
  console.log(base);
  await base("Events")
    .select({
      fields: [
        ...eventFields,
        ...(CONSTS.MULTIPLE_EVENTS ? fieldsIfMultipleEvents : []),
      ],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        if (record.fields.Start && record.fields.End) {
          events.push(record.fields);
        }
      });
      fetchNextPage();
    });
  console.log("Got events", events);
  return events;
}

export async function getEventByName(name: string) {
  const events: Event[] = [];
  await base("Events")
    .select({
      fields: [
        ...eventFields,
        ...(CONSTS.MULTIPLE_EVENTS ? fieldsIfMultipleEvents : []),
      ],
      filterByFormula: `{Name} = "${name}"`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        events.push(record.fields);
      });
      fetchNextPage();
    });
  return events[0];
}
