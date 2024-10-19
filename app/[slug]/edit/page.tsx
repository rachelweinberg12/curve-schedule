import { getGuestBySlug } from "@/db/guests";
import { getUserSlug } from "@/db/auth";
import EditProfileForm from "./edit-profile-form";

export default async function EditProfilePage(props: {
  params: { slug: string };
}) {
  const { slug } = props.params;
  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return <div>Profile not found</div>;
  }
  const userSlug = getUserSlug();
  const isUsersProfile = userSlug === slug;

  if (!isUsersProfile) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  return <EditProfileForm profile={guest} />;
}
