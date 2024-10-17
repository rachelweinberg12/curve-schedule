import { GuestProfile } from "@/db/guests";

export function ProfilePage(props: {
  guest: GuestProfile;
  isUsersProfile: boolean;
}) {
  const { guest, isUsersProfile } = props;
  return (
    <div>
      <h1>{guest.Name}</h1>
      <p>{guest.Bio}</p>
      {isUsersProfile && <p>This is your profile</p>}
    </div>
  );
}
