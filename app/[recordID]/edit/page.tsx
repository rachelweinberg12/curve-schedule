import { getGuestByID } from "@/db/guests";
import { getUserRecordID } from "@/db/auth";
import EditProfileForm from "./edit-profile-form";

export default async function EditProfilePage(props: {
  params: { recordID: string };
}) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  const userRecordID = getUserRecordID();
  const isUsersProfile = userRecordID === recordID;

  if (!isUsersProfile) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  return <EditProfileForm profile={guest} />;
}
