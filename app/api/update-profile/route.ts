import { NextResponse } from "next/server";
import { base } from "@/db/db";
import { getUserSessionClaims } from "@/db/auth";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { clerkSecretKey } from "@/utils/clerk-config";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userSessionClaims = getUserSessionClaims();

  try {
    const formData = await req.formData();
    const updatedImage = formData.get("updatedImage");

    // Update Clerk profile image if a new image is provided
    if (updatedImage) {
      const clerkClient = createClerkClient({ secretKey: clerkSecretKey });
      await clerkClient.users.updateUserProfileImage(userId, {
        file: updatedImage as Blob,
      });
    }

    await base("Guests").update([
      {
        id: userSessionClaims.metadata?.record_id,
        fields: {
          Title: formData.get("Title"),
          Bio: formData.get("Bio"),
          X: formData.get("X"),
          "Personal website": formData.get("Personal website"),
          LinkedIn: formData.get("LinkedIn"),
          Github: formData.get("Github"),
          Discord: formData.get("Discord"),
          "Exp topics": formData.get("Exp topics"),
          "Curious topics": formData.get("Curious topics"),
          "Shirt size": formData.get("Shirt size"),
          "Private notes": formData.get("Private notes"),
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
