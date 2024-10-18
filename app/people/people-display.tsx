"use client";

import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import { ProfileCard } from "./profile-card";
import { checkStringForSearch } from "@/utils/utils";
import { useState } from "react";
import { Input } from "../input";

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
  const sortedAlphabet = filteredGuests.sort((a, b) =>
    a.profile.Name.localeCompare(b.profile.Name)
  );
  const sortedByPriority = sortedAlphabet.sort((a, b) => {
    const priorityA = assessProfilePriority(a.profile);
    const priorityB = assessProfilePriority(b.profile);
    return priorityB - priorityA;
  });
  const sortedByCompleteness = sortedByPriority.sort((a, b) => {
    const completenessA = assessProfileCompleteness(a.profile, a.account);
    const completenessB = assessProfileCompleteness(b.profile, b.account);
    return completenessB - completenessA;
  });
  return (
    <div className="mx-auto max-w-5xl">
      <Input
        className="max-w-5xl w-full mb-5 mx-auto"
        placeholder="Search people"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedByCompleteness.map((guest) => {
          return (
            <ProfileCard
              key={guest.profile.ID}
              profile={guest.profile}
              account={guest.account}
            />
          );
        })}
      </div>
    </div>
  );
}

export function profileHasSocials(profile: GuestProfile) {
  return (
    profile.X ||
    profile.LinkedIn ||
    profile.Discord ||
    profile.Github ||
    profile["Personal website"]
  );
}

function assessProfileCompleteness(
  profile: GuestProfile,
  account?: SimpleUser
) {
  let completeness = 0;
  if (profile.Name) completeness += 1;
  if (profile.Title) completeness += 1;
  if (account?.imageUrl) completeness += 1;
  if (profileHasSocials(profile)) completeness += 1;
  return completeness;
}

function assessProfilePriority(profile: GuestProfile) {
  if (profile.Type === "Speaker") return 4;
  if (profile.Type === "Staff") return 3;
  if (profile.Type === "Facilitator") return 2;
  return 1;
}

function profileMatchesSearch(profile: GuestProfile, search: string) {
  return (
    !search ||
    checkStringForSearch(search, profile.Name) ||
    checkStringForSearch(search, profile.Title ?? "")
  );
}
