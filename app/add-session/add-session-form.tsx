"use client";
import { useEffect, useState } from "react";
import { Input, Textarea } from "@/components/input";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import {
  convertParamDateTime,
  dateOnDay,
  getAvailableStartTimes,
} from "@/utils/utils";
import {
  MyListbox,
  SelectDay,
  SelectDuration,
  SelectHosts,
} from "@/components/select";
import { Day } from "@/db/days";
import { BasicGuest } from "@/db/guests";
import { Location } from "@/db/locations";
import { Session } from "@/db/sessions";
import { RequiredStar } from "@/components/tags";

export function AddSessionForm(props: {
  days: Day[];
  sessions: Session[];
  locations: Location[];
  guests: BasicGuest[];
}) {
  const { days, sessions, locations, guests } = props;
  const searchParams = useSearchParams();
  const dayParam = searchParams?.get("day");
  const timeParam = searchParams?.get("time");
  const initLocation = searchParams?.get("location");
  const initDateTime =
    dayParam && timeParam
      ? convertParamDateTime(dayParam, timeParam)
      : undefined;
  const initDay = initDateTime
    ? days.find((d) => dateOnDay(initDateTime, d))
    : undefined;
  const initTime = initDateTime
    ? DateTime.fromJSDate(initDateTime)
        .setZone("America/Los_Angeles")
        .toFormat("h:mm a")
    : undefined;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(initDay ?? days[0]);
  const [location, setLocation] = useState(
    locations.find((l) => l.Name === initLocation)?.Name
  );
  const startTimes = getAvailableStartTimes(day, sessions, location);
  const initTimeValid = startTimes.some((st) => st.formattedTime === initTime);
  const [startTime, setStartTime] = useState(
    initTimeValid ? initTime : undefined
  );
  const maxDuration = startTimes.find(
    (st) => st.formattedTime === startTime
  )?.maxDuration;
  const [duration, setDuration] = useState(Math.min(maxDuration ?? 60, 60));
  const [hosts, setHosts] = useState<BasicGuest[]>([]);
  useEffect(() => {
    if (
      !startTimes.some((st) => st.formattedTime === startTime && st.available)
    ) {
      setStartTime(undefined);
    }
    if (maxDuration && duration > maxDuration) {
      setDuration(maxDuration);
    }
  }, [startTime, maxDuration, duration, startTimes]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Submit = async () => {
    setIsSubmitting(true);
    const res = await fetch("/api/add-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        day: day,
        location: locations.find((loc) => loc.Name === location),
        startTimeString: startTime,
        duration,
        hosts: hosts,
      }),
    });
    if (res.ok) {
      console.log("Session added successfully");
      router.push(`/add-session/confirmation`);
    } else {
      console.error("Failed to add session");
    }
    setIsSubmitting(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold">Add a session</h2>
        <p className="text-sm text-gray-500 mt-2">
          Fill out this form to add a session to the schedule! Your session will
          be added to the schedule immediately, but we may reach out to you
          about rescheduling, relocating, or cancelling.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Session title
          <RequiredStar />
        </label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Description <RequiredStar />
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          richText
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">Co-hosts</label>
        <p className="text-sm text-gray-500">
          Any cohosts who have agreed to host this session with you. All hosts
          will get an email confirmation when this form is submitted.
        </p>
        <SelectHosts guests={guests} hosts={hosts} setHosts={setHosts} />
      </div>
      <div className="flex flex-col gap-1 w-72">
        <label className="font-medium">
          Location
          <RequiredStar />
        </label>
        <MyListbox
          currValue={location}
          setCurrValue={setLocation}
          options={locations.map((loc) => {
            return {
              value: loc.Name,
              available: true,
              helperText: `max ${loc.Capacity}`,
            };
          })}
          placeholder={"Select a location"}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Day
          <RequiredStar />
        </label>
        <SelectDay days={days} day={day} setDay={setDay} />
      </div>
      <div className="flex flex-col gap-1 w-72">
        <label className="font-medium">
          Start Time
          <RequiredStar />
        </label>
        <MyListbox
          currValue={startTime}
          setCurrValue={setStartTime}
          options={startTimes.map((st) => {
            return { value: st.formattedTime, available: st.available };
          })}
          placeholder={"Select a start time"}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">
          Duration
          <RequiredStar />
        </label>
        <SelectDuration
          duration={duration}
          setDuration={setDuration}
          maxDuration={maxDuration}
        />
      </div>
      <button
        type="submit"
        className="bg-orange-500 text-white font-semibold py-2 rounded shadow disabled:bg-gray-700 disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:bg-orange-600 mx-auto px-12"
        disabled={
          !title ||
          !startTime ||
          !location ||
          !day ||
          !duration ||
          !duration ||
          isSubmitting
        }
        onClick={Submit}
      >
        Submit
      </button>
    </div>
  );
}
