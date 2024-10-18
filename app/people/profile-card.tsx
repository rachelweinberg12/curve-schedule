import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import Image from "next/image";
import { ColoredTag, TypeTagColor } from "../tags";
import Link from "next/link";
import { SocialLinks } from "./socials";
import { generateSlug } from "@/utils/utils";

export function ProfileCard(props: {
  profile: GuestProfile;
  account?: SimpleUser;
}) {
  const { profile, account } = props;
  const userSlug = generateSlug(profile.Name);
  return (
    <div
      key={profile.ID}
      className="flex flex-col gap-3 divide-y divide-gray-300 p-6 rounded-lg shadow"
    >
      <Link
        href={`/${userSlug}`}
        className="flex w-full items-center justify-between"
      >
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {profile.Name}
            </h3>
            {profile.Type !== "Attendee" && profile.Type !== "Facilitator" && (
              <ColoredTag
                text={profile.Type}
                color={TypeTagColor[profile.Type]}
              />
            )}
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
      </Link>
      <SocialLinks profile={profile} sizeClass="h-4 w-4" />
    </div>
  );
}
