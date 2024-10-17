import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import Image from "next/image";
import clsx from "clsx";

export function ProfileCard(props: {
  guest: GuestProfile;
  guestAccount?: SimpleUser;
}) {
  const { guest, guestAccount } = props;
  return (
    <li
      key={guest.ID}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {guest.Name}
            </h3>
            <TypeTag type={guest.Type} />
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{guest.Title}</p>
        </div>
        {guestAccount && (
          <Image
            alt={guest.Name}
            src={guestAccount.imageUrl}
            className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
            height="100"
            width="100"
          />
        )}
      </div>
    </li>
  );
}

const TypeTagColor = {
  Speaker: "green",
  Attendee: "yellow",
  Facilitator: "teal",
  Staff: "purple",
};
function TypeTag(props: { type: keyof typeof TypeTagColor }) {
  const color = TypeTagColor[props.type];
  return (
    <span
      className={clsx(
        "inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
        `bg-${color}-100 text-${color}-600 border border-${color}-600`
      )}
    >
      {props.type}
    </span>
  );
}
