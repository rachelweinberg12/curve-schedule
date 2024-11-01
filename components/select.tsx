import { Fragment, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Day } from "@/db/days";
import { format } from "date-fns";
import { BasicGuest } from "@/db/guests";
import { useUserRecordID } from "@/utils/hooks";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string;
  available: boolean;
  helperText?: string;
};
export function MyListbox(props: {
  options: Option[];
  currValue?: string;
  setCurrValue: (value: string) => void;
  placeholder: string;
}) {
  const { options, currValue, setCurrValue, placeholder } = props;
  const currOption = options.find((option) => option.value === currValue);
  return (
    <Listbox value={currValue} onChange={setCurrValue}>
      <div className="relative mt-1">
        <Listbox.Button className="h-12 rounded-md border px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 focus:outline-none relative border-gray-500 w-full cursor-pointer focus:ring-2 focus:ring-orange-500 focus:outline-0 focus:border-none bg-gray-800 py-2 pl-3 pr-10 text-left">
          {currValue ? (
            <span className="text-white truncate flex items-center justify-between">
              {currValue}
              {currOption?.helperText && (
                <span className="inline text-xs text-gray-400 truncate">
                  {currOption.helperText}
                </span>
              )}
            </span>
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-72 overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {options.map((option) => {
              return (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-pointer select-none py-2 pl-10 pr-4 z-10 disabled:text-gray-400 disabled:cursor-default",
                      active
                        ? "bg-orange-900 text-orange-100"
                        : "text-white bg-gray-800"
                    )
                  }
                  disabled={!option.available}
                >
                  {({ selected, disabled }) => (
                    <>
                      <span
                        className={clsx(
                          "flex items-end justify-between truncate",
                          selected ? "font-medium" : "font-normal",
                          disabled ? "text-gray-400" : "text-white"
                        )}
                      >
                        {option.value}
                        {option.helperText && (
                          <span className="inline text-xs text-gray-400 truncate">
                            {option.helperText}
                          </span>
                        )}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export function SelectDuration(props: {
  duration: number;
  setDuration: (duration: number) => void;
  maxDuration?: number;
}) {
  const { duration, setDuration, maxDuration = 120 } = props;
  const durations = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 150, label: "2.5 hours" },
    { value: 180, label: "3 hours" },
    { value: 210, label: "3.5 hours" },
    { value: 240, label: "4 hours" },
  ];
  const availableDurations = durations.filter(
    ({ value }) => value <= maxDuration
  );
  return (
    <fieldset>
      <div className="space-y-4">
        {availableDurations.map(({ value, label }) => (
          <div key={value} className="flex items-center">
            <input
              id={label}
              type="radio"
              checked={value === duration}
              onChange={() => setDuration(value)}
              className="h-4 w-4 border-gray-700 text-orange-500 focus:ring-orange-500"
            />
            <label
              htmlFor={label}
              className="ml-3 block text-sm font-medium leading-6 text-white"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function SelectDay(props: {
  days: Day[];
  day: Day;
  setDay: (day: Day) => void;
}) {
  const { days, day, setDay } = props;
  return (
    <fieldset>
      <div className="space-y-4">
        {days.map((d) => {
          const formattedDay = format(d.Start, "EEEE, MMMM d");
          return (
            <div key={formattedDay} className="flex items-center">
              <input
                id={formattedDay}
                type="radio"
                checked={d.Start === day.Start}
                onChange={() => setDay(d)}
                className="h-4 w-4 border-gray-700 text-orange-500 focus:ring-orange-500"
              />
              <label
                htmlFor={formattedDay}
                className="ml-3 block text-sm font-medium leading-6 text-white"
              >
                {formattedDay}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SelectHosts(props: {
  guests: BasicGuest[];
  hosts: BasicGuest[];
  setHosts: (hosts: BasicGuest[]) => void;
}) {
  const { guests, hosts, setHosts } = props;
  const [query, setQuery] = useState("");
  const userRecordID = useUserRecordID();
  const filteredGuests = guests
    .filter((guest) =>
      guest["Name"].toLowerCase().includes(query.toLowerCase())
    )
    .filter((guest) => guest["Name"].trim().length > 0)
    .filter((guest) => guest["ID"] !== userRecordID)
    .sort((a, b) => a["Name"].localeCompare(b["Name"]))
    .slice(0, 20);
  return (
    <div className="w-full">
      <Combobox
        value={hosts}
        onChange={(newHosts) => {
          setHosts(newHosts);
          setQuery("");
        }}
        multiple
      >
        <div className="relative mt-1">
          <Combobox.Button className="relative w-full min-h-12 h-fit rounded-md border px-4 shadow-sm transition-colors focus:outline-none border-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-0 focus:border-none bg-gray-800 py-2 pl-3 pr-10 text-left placeholder:text-gray-400">
            <div className="flex flex-wrap gap-1 items-center">
              {hosts.length > 0 && (
                <>
                  {hosts.map((host) => (
                    <span
                      key={host.ID}
                      className="py-1 px-2 bg-gray-700 rounded text-nowrap text-sm flex items-center gap-1"
                    >
                      {host.Name}
                      <button
                        onClick={() =>
                          setHosts(hosts.filter((h) => h !== host))
                        }
                      >
                        <XMarkIcon className="h-3 w-3 text-gray-400" />
                      </button>
                    </span>
                  ))}
                </>
              )}
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                value={query}
                className="border-none focus:ring-0 px-0 py-1 text-sm focus:w-fit w-0 placeholder:text-gray-400 bg-gray-800"
              />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {filteredGuests.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredGuests.map((guest) => (
                  <Combobox.Option
                    key={guest["ID"]}
                    className={({ active }) =>
                      clsx(
                        "relative cursor-pointer select-none py-2 pl-10 pr-4 z-10",
                        active
                          ? "bg-orange-900 text-orange-100"
                          : "text-white bg-gray-800"
                      )
                    }
                    value={guest}
                  >
                    {({ selected, disabled }) => (
                      <>
                        <span
                          className={clsx(
                            "block truncate",
                            selected ? "font-medium" : "font-normal",
                            disabled ? "text-gray-500" : "text-white"
                          )}
                        >
                          {guest.Name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
