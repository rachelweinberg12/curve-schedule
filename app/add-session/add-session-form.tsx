"use client";
import clsx from "clsx";
import { useState } from "react";
import { Input } from "../input";
import { Day } from "@/utils/constants";
import { format } from "date-fns";
import { Session, Location } from "@/utils/db";

export function AddSessionForm(props: {
  days: Day[];
  sessions: Session[];
  locations: Location[];
}) {
  const { days } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(days[0]);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [hosts, setHosts] = useState("");
  const [location, setLocation] = useState("");
  const DURATIONS = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];
  console.log(day);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label>Session title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label>Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label>Day</label>
        <fieldset>
          <div className="space-y-4">
            {days.map((d) => {
              const formattedDay = format(d.start, "EEEE, MMMM d");
              console.log(d, day, d.start === day.start);
              return (
                <div key={formattedDay} className="flex items-center">
                  <input
                    id={formattedDay}
                    type="radio"
                    checked={d.start === day.start}
                    onChange={() => setDay(d)}
                    className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
                  />
                  <label
                    htmlFor={formattedDay}
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    {formattedDay}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col gap-1">
        <label>Start Time</label>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label>Duration</label>
        <fieldset>
          <div className="space-y-4">
            {DURATIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center">
                <input
                  id={label}
                  type="radio"
                  checked={value === duration}
                  onChange={() => setDuration(value)}
                  className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
                />
                <label
                  htmlFor={label}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col gap-1">
        <label>Hosts</label>
        <Input value={hosts} onChange={(e) => setHosts(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label>Location</label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <button
        type="submit"
        className={clsx(
          "bg-rose-400 text-white font-bold py-2 px-4 rounded",
          "hover:bg-rose-500 active:bg-rose-500"
        )}
      >
        Add Session
      </button>
    </div>
  );
}

function getStartTimes(day: Day, sessions: Session[]) {}