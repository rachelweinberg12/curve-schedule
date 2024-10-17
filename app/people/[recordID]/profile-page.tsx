import { GuestProfile } from "@/db/guests";

export function ProfilePage(props: { guest: GuestProfile }) {
  return (
    <div>
      <h1>{props.guest.Name}</h1>
      <p>{props.guest.Bio}</p>
    </div>
  );
}
