import { getEventByName } from "@/db/events";
import EventPage from "./event-page";
import { CONSTS } from "@/utils/constants";

export default async function Page() {
  const event = await getEventByName(CONSTS.TITLE);
  return <EventPage event={event} />;
}
