import { CONSTS } from "@/utils/constants";
import { base } from "./db";

export type BasicGuest = {
  Name: string;
  Email: string;
  ID: string;
};

export type GuestProfile = {
  Name: string;
  Email: string;
  Bio: string;
  ID: string;
};

export async function getGuests() {
  const guests: BasicGuest[] = [];
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestsByEvent(eventName: string) {
  const guests: BasicGuest[] = [];
  const filterFormula = CONSTS.MULTIPLE_EVENTS
    ? `SEARCH("${eventName}", {Events}) != 0`
    : "1";
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
      filterByFormula: filterFormula,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestByID(guestID: string) {
  const guests: GuestProfile[] = [];
  await base("Guests")
    .find(guestID)
    .then(function (record: any) {
      guests.push({ ...record.fields });
    });
  return guests[0];
}
