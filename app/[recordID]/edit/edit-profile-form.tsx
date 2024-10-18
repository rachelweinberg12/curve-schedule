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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="Title" className="block mb-2">Title</label>
        <input
          type="text"
          id="Title"
          name="Title"
          value={editedProfile.Title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="Bio" className="block mb-2">Bio</label>
        <textarea
          id="Bio"
          name="Bio"
          value={editedProfile.Bio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
      {["X", "Personal website", "LinkedIn", "Github", "Discord"].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block mb-2">{field}</label>
          <input
            type="text"
            id={field}
            name={field}
            value={editedProfile[field as keyof GuestProfile] as string}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Save Changes
      </button>
    </form>
  );
}
