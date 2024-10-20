import { redirect } from "next/navigation";
import { getUserSlug } from "@/db/auth";

export default async function MePage({
  params,
}: {
  params: { action?: string[] };
}) {
  const userSlug = getUserSlug();

  if (!userSlug) {
    // Redirect to sign-in page if the user is not authenticated
    return redirect("/sign-in");
  }

  if (params.action?.[0] === "edit") {
    // Redirect to the edit profile page
    return redirect(`/${userSlug}/edit`);
  }

  // Redirect to the user's profile page
  return redirect(`/${userSlug}`);
}
