import { getGuestByID } from "@/db/guests";
import { getUserByEmail, getUserRecordID } from "@/db/auth";
import EditProfileForm from "./edit-profile-form";

export default async function EditProfilePage(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const guestAccount = await getUserByEmail(guest.Email);
  const userRecordID = getUserRecordID();
  const isUsersProfile = userRecordID === recordID;

  if (!isUsersProfile) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  return <EditProfileForm profile={guest} />;
}
