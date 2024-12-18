"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GuestProfile } from "@/db/guests";
import { Input, Textarea } from "@/components/input";
import { generateSlug } from "@/utils/utils";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useLocalStorage } from "@/utils/hooks";
import { SparklesIcon } from "@heroicons/react/24/solid";

const shirtSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export function EditProfileForm(props: {
  profile: GuestProfile;
  imageUrl?: string;
}) {
  const { profile, imageUrl } = props;
  const { value: editedProfile, setValue: setEditedProfile } = useLocalStorage(
    profile,
    "editedProfile"
  );
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProfile.Name,
          title: editedProfile.Title,
        }),
      });
      if (response.ok) {
        const { bio } = await response.json();
        setEditedProfile({ ...editedProfile, Bio: bio });
      } else {
        console.error("Failed to generate bio");
      }
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (updatedImage) {
        formData.append("updatedImage", updatedImage);
      }
      Object.entries(editedProfile).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      const userSlug = generateSlug(editedProfile.Name);
      router.push(`/${userSlug}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold">Edit profile</h2>
      </div>
      <hr className="border-gray-700 my-3" />
      <h3 className="text-xl font-bold">General</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="h-24 w-24">
          {updatedImage || imageUrl ? (
            <Image
              width={100}
              height={100}
              className="my-0 h-24 w-24 rounded-full object-cover"
              src={
                updatedImage
                  ? URL.createObjectURL(updatedImage)
                  : (imageUrl as string)
              }
              alt="Your profile image"
            />
          ) : (
            <UserCircleIcon className="w-24 h-24" />
          )}
        </div>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/png, image/jpeg"
          onChange={(event) => {
            setUpdatedImage(event.target.files ? event.target.files[0] : null);
          }}
        />
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
          <div className="flex justify-between w-full items-end">
            <label htmlFor="Bio" className="font-medium">
              Bio
            </label>
            <button
              type="button"
              onClick={handleGenerateBio}
              disabled={isGeneratingBio}
              className="bg-orange-500 text-white text-sm font-semibold py-1 rounded shadow hover:bg-orange-600 px-3 flex items-center gap-2 disabled:opacity-50"
            >
              <SparklesIcon className="h-5 w-5" />
              {isGeneratingBio ? "Generating..." : "Generate"}
            </button>
          </div>
          <Textarea
            id="Bio"
            name="Bio"
            value={editedProfile.Bio}
            onChange={handleChange}
            rows={5}
            richText
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Exp topics" className="font-medium">
            What topics are you well-versed in and opinionated on? (which
            you&apos;d like to discuss)
          </label>
          <Textarea
            id="Exp topics"
            name="Exp topics"
            value={editedProfile["Exp topics"]}
            onChange={handleChange}
            rows={5}
            richText
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="Curious topics" className="font-medium">
            What topics are you confused, uncertain, or curious about? (which
            you&apos;d like to discuss)
          </label>
          <Textarea
            id="Curious topics"
            name="Curious topics"
            value={editedProfile["Curious topics"]}
            onChange={handleChange}
            rows={5}
            richText
          />
        </div>
        <hr className="border-gray-700 my-3" />
        <h3 className="text-xl font-bold">Socials</h3>
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
        <hr className="border-gray-700 my-3" />
        <h3 className="text-xl font-bold">Private, for organizers only</h3>
        <div className="mb-4">
          <label className="font-medium">Shirt size</label>
          <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            {shirtSizes.map((size) => (
              <div key={size} className="flex items-center">
                <input
                  id={`shirt-size-${size}`}
                  name="Shirt size"
                  type="radio"
                  value={size}
                  checked={editedProfile["Shirt size"] === size}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor={`shirt-size-${size}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="private-notes" className="font-medium">
            Anything else the organizers should know?
          </label>
          <span className="text-sm text-gray-400 mb-1">
            Please let us know here if you have any dietary restrictions, other
            allergies, or accessibility needs we should know about.
          </span>
          <Textarea
            id="private-notes"
            name="Private notes"
            rows={4}
            value={editedProfile["Private notes"]}
            onChange={handleChange}
          />
        </div>
        {submitError && (
          <div className="text-rose-500 text-sm font-medium text-center">
            {submitError}
          </div>
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
