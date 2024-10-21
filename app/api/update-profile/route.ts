import { NextResponse } from "next/server";
import { base } from "@/db/db";
import { getUserRecordID } from "@/db/auth";

export async function POST(req: Request) {
  const userRecordID = await getUserRecordID();
  if (!userRecordID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updatedProfile = await req.json();

  try {
    await base("Guests").update([
      {
        id: userRecordID,
        fields: {
          Title: updatedProfile.Title,
          Bio: updatedProfile.Bio,
          X: updatedProfile.X,
          "Personal website": updatedProfile["Personal website"],
          LinkedIn: updatedProfile.LinkedIn,
          Github: updatedProfile.Github,
          Discord: updatedProfile.Discord,
          "Exp topics": updatedProfile["Exp topics"],
          "Curious topics": updatedProfile["Curious topics"],
          Goals: updatedProfile.Goals,
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
