import { getGuestBySlug } from "@/db/guests";
import { getUserSlug } from "@/db/auth";
import EditProfileForm from "./edit-profile-form";
import { redirect } from "next/navigation";

export default async function EditProfilePage(props: {
  params: { slug: string };
}) {
  let { slug } = props.params;

  // If the slug is "me", get the user's actual slug
  if (slug === "me") {
    const userSlug = getUserSlug();
    if (!userSlug) {
      return redirect("/sign-in");
    }
    slug = userSlug;
  }

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
