"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GuestProfile } from "@/db/guests";
import { Input, Textarea } from "@/app/input";
import { generateSlug } from "@/utils/utils";

export default function EditProfileForm({
  profile,
}: {
  profile: GuestProfile;
}) {
  const [editedProfile, setEditedProfile] = useState(profile);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });
      if (response.ok) {
        const userSlug = generateSlug(editedProfile.Name);
        router.push(`/${userSlug}`);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Edit profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="Title" className="font-medium">
            Title
          </label>
          <Input
            type="text"
            id="Title"
            name="Title"
            value={editedProfile.Title}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Bio" className="font-medium">
            Bio
          </label>
          <Textarea
            id="Bio"
            name="Bio"
            value={editedProfile.Bio}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Exp topics" className="font-medium">
            What topics are you&apos;re well-versed in and opinionated on, which
            you&apos;d like to discuss?
          </label>
          <Textarea
            id="Exp topics"
            name="Exp topics"
            value={editedProfile["Exp topics"]}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Curious topics" className="font-medium">
            What topics are you confused, uncertain, or curious about, which
            you&apos;d like to discuss?
          </label>
          <Textarea
            id="Curious topics"
            name="Curious topics"
            value={editedProfile["Curious topics"]}
            onChange={handleChange}
            rows={4}
          />
        </div>
        {["X", "Personal website", "LinkedIn", "Github", "Discord"].map(
          (field) => (
            <div key={field} className="flex flex-col gap-1">
              <label htmlFor={field} className="font-medium">
                {field}
              </label>
              <Input
                type="text"
                id={field}
                name={field}
                value={editedProfile[field as keyof GuestProfile] as string}
                onChange={handleChange}
              />
            </div>
          )
        )}
        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold py-2 rounded shadow hover:bg-orange-600 mx-auto px-12"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
