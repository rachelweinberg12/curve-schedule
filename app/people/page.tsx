import { getUsers } from "@/db/auth";
import { getGuestProfiles } from "@/db/guests";
import { PeopleDisplay } from "./people-display";

export default async function PeoplePage() {
  const [users, guests] = await Promise.all([getUsers(), getGuestProfiles()]);
  return <PeopleDisplay users={users} guests={guests} />;
}
