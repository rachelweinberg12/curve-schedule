"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";

export async function rsvp(sessionId: string, remove = false) {
  await fetch("/api/toggle-rsvp", {
    method: "POST",
    body: JSON.stringify({
      sessionId,
      remove,
    }),
  });
}

export function RSVPButton(props: { rsvp: () => void; rsvpd: boolean }) {
  const { rsvp, rsvpd } = props;
  return (
    <div className="flex items-center gap-1">
      <label className="text-xs text-gray-400">RSVP</label>
      <Switch
        checked={rsvpd}
        onChange={rsvp}
        className={clsx(
          "group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparenttransition-colors duration-200 ease-in-out focus:outline-none",
          rsvpd
            ? "bg-orange-500 border-orange-500"
            : "bg-gray-600 border-gray-600"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-700 shadow ring-0 transition duration-200 ease-in-out",
            rsvpd ? "translate-x-5" : "translate-x-0"
          )}
        />
      </Switch>
    </div>
  );
}
