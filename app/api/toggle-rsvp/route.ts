import { getUserRecordID } from "@/db/auth";
import { base } from "@/db/db";

type RSVPParams = {
  sessionId: string;
  remove?: boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const { sessionId, remove } = (await req.json()) as RSVPParams;
  const guestID = getUserRecordID();

  if (!guestID) {
    return Response.json({ success: false, error: "No user found" });
  }

  if (!remove) {
    // Check for existing RSVP
    const existingRSVPs: any[] = [];
    await base("RSVPs")
      .select({
        filterByFormula: `AND({Session ID} = "${sessionId}", {Guest ID} = "${guestID}")`,
      })
      .eachPage(function page(records: any, fetchNextPage: any) {
        records.forEach(function (record: any) {
          existingRSVPs.push(record);
        });
        fetchNextPage();
      });

    if (existingRSVPs.length > 0) {
      return Response.json({
        success: false,
        error: "You have already RSVP'd to this session",
      });
    }

    await base("RSVPs").create(
      [
        {
          fields: { Session: [sessionId], Guest: [guestID] },
        },
      ],
      function (err: string, records: any) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record: any) {
          console.log(record.getId());
        });
      }
    );
  } else {
    console.log("REMOVING RSVP", { sessionId, guestID });
    await base("RSVPs")
      .select({
        filterByFormula: `AND({Session ID} = "${sessionId}", {Guest ID} = "${guestID}")`,
      })
      .eachPage(function page(records: any, fetchNextPage: any) {
        console.log("RECORDS", { records });
        records.forEach(function (record: any) {
          base("RSVPs").destroy([record.getId()], function (err: string) {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
        fetchNextPage();
      });
  }

  return Response.json({ success: true });
}
