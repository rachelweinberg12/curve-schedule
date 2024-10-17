import SummaryPage from "./summary-page";
import EventPage from "./schedule/event-page";
import { getEvents } from "@/db/events";
import { CONSTS } from "@/utils/constants";

export default async function Home() {
  const events = await getEvents();
  const sortedEvents = events.sort((a, b) => {
    return new Date(a.Start).getTime() - new Date(b.Start).getTime();
  });
  if (CONSTS.MULTIPLE_EVENTS) {
    return <SummaryPage events={sortedEvents} />;
  } else {
    return <EventPage event={sortedEvents[0]} />;
  }
}
