import { getUsers } from "@/db/auth";
import { getGuestProfiles } from "@/db/guests";
import { PeopleDisplay } from "./people-display";

export default async function PeoplePage() {
  const users = await getUsers();
  const guests = await getGuestProfiles();
  return (
    <div>
      <PeopleDisplay users={users} guests={guests} />
    </div>
  );
}
