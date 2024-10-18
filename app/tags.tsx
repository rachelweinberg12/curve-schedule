import clsx from "clsx";
import Link from "next/link";

export function PersonLink(props: { recordID: string; name: string }) {
  const { recordID, name } = props;
  return (
    <Link
      href={`/${recordID}`}
      className="bg-gray-100 px-1.5 py-0.5 rounded-sm hover:bg-gray-200"
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
        `text-${color}-500 bg-${color}-100 border-2 border-${color}-400`
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
