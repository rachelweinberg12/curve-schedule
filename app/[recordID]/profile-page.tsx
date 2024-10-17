import { GuestProfile } from "@/db/guests";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";

export function ProfilePage(props: {
  guest: GuestProfile;
  guestAccount?: User;
  isUsersProfile: boolean;
}) {
  const { guest, guestAccount, isUsersProfile } = props;
  return (
    <div>
      {guestAccount && (
        <Image
          src={guestAccount.imageUrl}
          alt={guest.Name}
          height="100"
          width="100"
          className="rounded-full"
        />
      )}
      <h1>{guest.Name}</h1>
      <p>{guest.Bio}</p>
      {isUsersProfile && <p>This is your profile</p>}
    </div>
  );
}
