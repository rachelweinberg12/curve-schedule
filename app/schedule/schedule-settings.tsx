"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  DocumentTextIcon,
  FlagIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export function ScheduleSettings() {
  const searchParams = useSearchParams();
  const [view, setView] = useState(searchParams.get("view") ?? "grid");
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <div className="flex flex-col gap-1">
      <SelectView
        urlSearchParams={urlSearchParams}
        view={view}
        setView={setView}
        pathname={pathname}
        replace={replace}
      />
    </div>
  );
}

function SelectView(props: {
  urlSearchParams: URLSearchParams;
  view: string;
  setView: (view: string) => void;
  pathname: string;
  replace: (url: string) => void;
}) {
  const { urlSearchParams, view, setView, pathname, replace } = props;
  const VIEWS = [
    {
      name: "grid",
      label: "Grid",
      icon: TableCellsIcon,
    },
    {
      name: "text",
      label: "Text",
      icon: DocumentTextIcon,
    },
    {
      name: "rsvp",
      label: "RSVP'd",
      icon: FlagIcon,
    },
  ];
  return (
    <div className="flex items-center gap-3">
      {VIEWS.map((v) => (
        <button
          key={v.name}
          className={clsx(
            "flex gap-1 items-center rounded-md text-xs sm:text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400",
            view === v.name
              ? "bg-rose-400 text-white"
              : "text-gray-400 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
          )}
          onClick={() => {
            if (view === v.name) return;
            setView(v.name);
            urlSearchParams.set("view", v.name);
            replace(`${pathname}?${urlSearchParams.toString()}`);
          }}
        >
          <v.icon className="h-4 w-4 stroke-2" />
          {v.label}
        </button>
      ))}
    </div>
  );
}
