"use client";
import { BasicGuest } from "@/db/guests";
import { useContext } from "react";
import { SelectHosts } from "./add-session/add-session-form";
import { UserContext } from "./context";
import { useRouter } from "next/navigation";

export function UserSelect({
  guests,
  showOnlyWhenUserSet,
}: {
  guests: BasicGuest[];
  showOnlyWhenUserSet?: boolean;
}) {
  const { user: currentUser, setUser } = useContext(UserContext);
  const router = useRouter();
  return (
    (!showOnlyWhenUserSet || currentUser) && (
      <SelectHosts
        guests={guests}
        hosts={guests.filter((guest) => guest.ID === currentUser)}
        setHosts={(hosts) => {
          setUser?.(hosts?.at(-1)!?.ID || null);
          router.refresh();
        }}
      />
    )
  );
}
