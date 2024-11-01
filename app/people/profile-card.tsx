import { GuestProfile } from "@/db/guests";
import { SimpleUser } from "@/db/auth";
import Image from "next/image";
import { ColoredTag, TypeTagColor } from "@/components/tags";
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
      className="flex flex-col p-6 rounded-lg shadow bg-gray-900"
    >
      <Link
        href={`/${userSlug}`}
        className="flex w-full items-start justify-between"
      >
        <div className="truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-white">
              {profile.Name}
            </h3>
            {profile.Type !== "Attendee" && profile.Type !== "Facilitator" && (
              <ColoredTag
                text={profile.Type}
                color={TypeTagColor[profile.Type]}
              />
            )}
          </div>
          <p className="mt-1 truncate text-sm text-gray-400 mr-2">
            {profile.Title}
          </p>
        </div>
        {account && (
          <Image
            src={account.imageUrl}
            alt={profile.Name}
            height="50"
            width="50"
            className="rounded-full h-10 w-10 object-cover"
          />
        )}
      </Link>
      <SocialLinks profile={profile} sizeClass="h-4 w-4" />
    </div>
  );
}
