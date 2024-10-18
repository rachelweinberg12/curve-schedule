import { CONSTS } from "@/utils/constants";
import { base } from "./db";
import { SimpleUser } from "./auth";
import { convertCamelToRegular } from "@/utils/utils";

export type BasicGuest = {
  Name: string;
  Email: string;
  ID: string;
};

export type GuestProfile = {
  Name: string;
  Email: string;
  Bio: string;
  Title: string;
  ID: string;
  Type: "Speaker" | "Attendee" | "Staff" | "Facilitator";
  X: string;
  LinkedIn: string;
  Discord: string;
  Github: string;
  "Personal website": string;
  Sessions: string[];
  RSVPs: string[];
};

export type GuestProfileAndAccount = {
  profile: GuestProfile;
  account?: SimpleUser;
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

export async function getGuestProfiles() {
  const guests: GuestProfile[] = [];
  await base("Guests")
    .select({
      fields: [
        "Name",
        "Email",
        "Bio",
        "Title",
        "Type",
        "X",
        "LinkedIn",
        "Discord",
        "Github",
        "Personal website",
        "Sessions",
        "RSVPs",
      ],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestBySlug(
  slug: string
): Promise<GuestProfile | null> {
  const guests: GuestProfile[] = [];
  const guestName = convertCamelToRegular(slug);
  await base("Guests")
    .select({
      filterByFormula: `{Name} = '${guestName}'`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests.length > 0 ? guests[0] : null;
}
