import { getGuestByID } from "@/db/guests";
import { ProfilePage } from "./profile-page";

export default async function Page(props: { params: { recordID: string } }) {
  const { recordID } = props.params;
  const guest = await getGuestByID(recordID);
  return <ProfilePage guest={guest} />;
}
