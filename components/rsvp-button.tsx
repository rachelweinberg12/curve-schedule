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

export function RSVPButton(props: {
  rsvp: () => void;
  rsvpd: boolean;
  disabled?: boolean;
}) {
  const { rsvp, rsvpd, disabled } = props;
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400">RSVP</label>
      <Switch
        checked={rsvpd}
        onChange={rsvp}
        disabled={disabled}
        className={clsx(
          "group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          rsvpd
            ? "bg-orange-500 border-orange-500"
            : "bg-gray-600 border-gray-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-gray-700 shadow ring-0 transition duration-200 ease-in-out mt-[1px]",
            rsvpd ? "translate-x-5" : "translate-x-0"
          )}
        />
      </Switch>
    </div>
  );
}
