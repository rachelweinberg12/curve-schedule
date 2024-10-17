"use client";

import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import { ProfileCard } from "./profile-card";

export function PeopleDisplay(props: {
  users: SimpleUser[];
  guests: GuestProfile[];
}) {
  const { users, guests } = props;
  return (
    <div>
      {guests.map((guest) => {
        const guestAccount = users.find((user) => user.recordID === guest.ID);
        return (
          <ProfileCard
            key={guest.ID}
            guest={guest}
            guestAccount={guestAccount}
          />
        );
      })}
    </div>
  );
}
