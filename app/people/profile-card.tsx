import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import Image from "next/image";
import clsx from "clsx";

export function ProfileCard(props: {
  profile: GuestProfile;
  account?: SimpleUser;
}) {
  const { profile, account } = props;
  return (
    <div
      key={profile.ID}
      className="flex w-full items-center justify-between space-x-6 p-6 rounded-lg shadow-sm"
    >
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-sm font-medium text-gray-900">
            {profile.Name}
          </h3>
          <TypeTag type={profile.Type} />
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{profile.Title}</p>
      </div>
      {account && (
        <Image
          alt={profile.Name}
          src={account.imageUrl}
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          height="100"
          width="100"
        />
      )}
    </div>
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
