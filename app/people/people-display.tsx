"use client";

import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import { ProfileCard } from "./profile-card";
import { checkStringForSearch } from "@/utils/utils";
import { useState } from "react";
import { Input } from "../schedule/input";

export function PeopleDisplay(props: {
  users: SimpleUser[];
  guests: GuestProfile[];
}) {
  const { users, guests } = props;
  const profilesAndAccounts = guests.map((guest) => {
    const account = users.find((user) => user.recordID === guest.ID);
    return { profile: guest, account };
  });
  const [search, setSearch] = useState("");
  const filteredGuests = profilesAndAccounts.filter((guest) =>
    profileMatchesSearch(guest.profile, search)
  );
  const sortedFilteredGuests = filteredGuests.sort((a, b) => {
    const completenessA = assessProfileCompleteness(a.profile, a.account);
    const completenessB = assessProfileCompleteness(b.profile, b.account);
    return completenessB - completenessA;
  });
  return (
    <div>
      <Input
        className="max-w-3xl w-full mb-5 mx-auto"
        placeholder="Search people"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {sortedFilteredGuests.map((guest) => {
        return (
          <ProfileCard
            key={guest.profile.ID}
            profile={guest.profile}
            account={guest.account}
          />
        );
      })}
    </div>
  );
}

function assessProfileCompleteness(
  guest: GuestProfile,
  guestAccount?: SimpleUser
) {
  let completeness = 0;
  if (guest.Name) completeness += 1;
  if (guest.Title) completeness += 1;
  if (guestAccount?.imageUrl) completeness += 1;
  if (
    guest.Twitter ||
    guest.LinkedIn ||
    guest.Discord ||
    guest["Personal website"]
  )
    completeness += 1;
  return completeness;
}

function profileMatchesSearch(profile: GuestProfile, search: string) {
  return (
    !search ||
    checkStringForSearch(search, profile.Name) ||
    checkStringForSearch(search, profile.Title ?? "")
  );
}
