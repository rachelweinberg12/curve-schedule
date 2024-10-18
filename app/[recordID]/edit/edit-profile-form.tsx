"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GuestProfile } from "@/db/guests";

export default function EditProfileForm({ profile }: { profile: GuestProfile }) {
  const [editedProfile, setEditedProfile] = useState(profile);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        router.push(`/${profile.ID}`);
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
          <label htmlFor="Title" className="font-medium">Title</label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={editedProfile.Title}
            onChange={handleChange}
            className="rounded-md text-sm border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Bio" className="font-medium">Bio</label>
          <textarea
            id="Bio"
            name="Bio"
            value={editedProfile.Bio}
            onChange={handleChange}
            rows={4}
            className="rounded-md text-sm resize-none border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        {["X", "Personal website", "LinkedIn", "Github", "Discord"].map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <label htmlFor={field} className="font-medium">{field}</label>
            <input
              type="text"
              id={field}
              name={field}
              value={editedProfile[field as keyof GuestProfile] as string}
              onChange={handleChange}
              className="rounded-md text-sm border bg-white px-4 py-2 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        ))}
        <button type="submit" className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 mx-auto px-12">
          Save Changes
        </button>
      </form>
    </div>
  );
}
