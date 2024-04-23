"use client";
import { Location } from "@/utils/db";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { locationOrder } from "./day";
import { useState } from "react";
import clsx from "clsx";
import { locationColors } from "./class-constants";
import { arraysEqual } from "@/utils/utils";

export function Filter(props: { locations: Location[] }) {
  const { locations } = props;
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col gap-4 w-full rounded-md border border-gray-100 p-2">
      <SelectLocCategoryToShow
        locations={locations}
        searchParams={searchParams}
      />
    </div>
  );
}

// TODO: store in airtable
const MAIN_SESSION_SPACES = ["Rat Park", "1E Main"];
type locationCategory = {
  name: string;
  locations: Location[];
  current: boolean;
};
function SelectLocCategoryToShow(props: {
  locations: Location[];
  searchParams: ReadonlyURLSearchParams;
}) {
  const { locations, searchParams } = props;
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const locCategories = [
    {
      name: "all",
      locations: locations,
    },
    {
      name: "main",
      locations: locations.filter((loc) =>
        MAIN_SESSION_SPACES.includes(loc.Name)
      ),
    },
    {
      name: "side",
      locations: locations.filter(
        (loc) => !MAIN_SESSION_SPACES.includes(loc.Name)
      ),
    },
  ] as locationCategory[];
  const [includedLocations, setIncludedLocations] = useState(
    urlSearchParams.getAll("loc")
  );
  const onSelectCategory = (category: locationCategory) => {
    locCategories.forEach((cat) => {
      cat.current = cat.name === category.name;
    });
    urlSearchParams.delete("loc");
    category.locations.forEach((loc) => {
      urlSearchParams.append("loc", loc.Name);
    });
    setIncludedLocations(category.locations.map((loc) => loc.Name));
    replace(`${pathname}?${urlSearchParams.toString()}`);
  };
  return (
    <div>
      <div className="flex space-x-4">
        {locCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat)}
            className={clsx(
              arraysEqual(
                cat.locations.map((loc) => loc.Name),
                includedLocations
              )
                ? "bg-gray-100 text-gray-700"
                : "text-gray-500 hover:text-gray-700",
              "rounded-md px-3 py-2 text-sm font-medium"
            )}
          >
            {cat.name.toLocaleUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mt-3">
        <SelectLocationsToShow
          locations={locations}
          searchParams={searchParams}
          includedLocations={includedLocations}
          setIncludedLocations={setIncludedLocations}
        />
      </div>
    </div>
  );
}

function SelectLocationsToShow(props: {
  locations: Location[];
  searchParams: ReadonlyURLSearchParams;
  includedLocations: string[];
  setIncludedLocations: (locations: string[]) => void;
}) {
  const { locations, searchParams, includedLocations, setIncludedLocations } =
    props;
  const urlSearchParams = new URLSearchParams(searchParams);
  const locationOptions = locationOrder.filter((loc) =>
    locations.find((l) => l.Name === loc)
  );
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <>
      {locationOptions.map((location) => (
        <div key={location} className="flex items-center">
          <input
            type="checkbox"
            className={clsx(
              "h-4 w-4 rounded border-gray-300 cursor-pointer",
              `text-${locationColors[location]}-400 focus:ring-${locationColors[location]}-400`
            )}
            id={location}
            name={location}
            checked={includedLocations.includes(location)}
            onChange={(event) => {
              const start = new Date();
              if (event.target.checked) {
                urlSearchParams.append("loc", location);
                setIncludedLocations([...includedLocations, location]);
              } else {
                urlSearchParams.delete("loc", location);
                setIncludedLocations(
                  includedLocations.filter((loc) => loc !== location)
                );
              }
              replace(`${pathname}?${urlSearchParams.toString()}`);
              const end = new Date();
              console.log(
                "Time to update URL:",
                end.getTime() - start.getTime()
              );
            }}
          />
          <label
            htmlFor={location}
            className="cursor-pointer pl-2 text-sm text-gray-700"
          >
            {location}
          </label>
        </div>
      ))}
    </>
  );
}
