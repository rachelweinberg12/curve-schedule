import { generateSlug } from "@/utils/utils";
import clsx from "clsx";
import Link from "next/link";

export function PersonLink(props: { name: string }) {
  const { name } = props;
  const userSlug = generateSlug(name);
  return (
    <Link
      href={`/${userSlug}`}
      className="bg-gray-700 px-1.5 py-0.5 rounded-sm hover:bg-gray-600"
    >
      {name}
    </Link>
  );
}

export function ColoredTag(props: { text: string; color: string }) {
  const { text, color } = props;
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full py-0.5 px-2 text-xs font-semibold w-fit",
        `text-${color}-700 bg-${color}-500 border-2 bg-opacity-10 border-${color}-700`
      )}
    >
      {text}
    </div>
  );
}

export const TypeTagColor = {
  Speaker: "yellow",
  Attendee: "green",
  Facilitator: "teal",
  Staff: "purple",
};
