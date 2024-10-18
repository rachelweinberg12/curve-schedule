"use client";
import { LinkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { GuestProfile } from "@/db/guests";

type Social = {
  name: keyof GuestProfile;
  formatFxn?: (username: string) => string;
  icon: (props: { className: string }) => JSX.Element;
};

const SOCIALS: Social[] = [
  {
    name: "X",
    formatFxn: (username: string) => {
      const pattern = /(?:https?:\/\/)?(?:www\.)?x\.com\/|@?/;
      const cleanedUsername = username.trim().replace(pattern, "");
      return `https://x.com/${cleanedUsername}`;
    },
    icon: (props: { className: string }) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    formatFxn: (username: string) => {
      const pattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/|@?/;
      const cleanedUsername = username.trim().replace(pattern, "");
      return `https://linkedin.com/in/${cleanedUsername}`;
    },
    icon: (props: { className: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
      >
        <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
      </svg>
    ),
  },
  {
    name: "Github",
    formatFxn: (username: string) => {
      const pattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/|@?/;
      const cleanedUsername = username.trim().replace(pattern, "");
      return `https://github.com/${cleanedUsername}`;
    },
    icon: (props: { className: string }) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Discord",
    icon: (props: { className: string }) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 127.14 96.36"
        fill="currentColor"
      >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
      </svg>
    ),
  },
  {
    name: "Personal website",
    formatFxn: (url: string) => {
      const pattern = /^(https?:\/\/)/;
      if (!pattern.test(url.trim())) {
        return `https://${url.trim()}`;
      }
      return url.trim();
    },
    icon: (props: { className: string }) => <LinkIcon {...props} />,
  },
];

function SocialLink(props: { name: string; username: string }) {
  const { name, username } = props;
  const social = SOCIALS.find((social) => social.name === name);
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(username);
    setCopied(true);
  };
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000); // Tooltip disappears after 2 seconds
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [copied]);
  if (!social) {
    return null;
  }
  if (social.formatFxn) {
    const formattedUsername = social.formatFxn(username);
    return (
      <a
        href={formattedUsername}
        target="_blank"
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
      >
        <social.icon className="h-5 w-5" />
      </a>
    );
  } else {
    return (
      <div className="relative inline-block">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <social.icon className="h-5 w-5" />
        </button>
        {copied && (
          <span className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 rounded bg-white text-sm px-2 py-1 border shadow-md border-gray-100 animate-fade-in-out w-fit text-nowrap">
            Copied username
          </span>
        )}
      </div>
    );
  }
}

export function SocialLinks(props: { profile: GuestProfile }) {
  const { profile } = props;
  return (
    <div className="flex gap-2">
      {SOCIALS.map((social) => {
        if (profile[social.name]) {
          return (
            <SocialLink
              key={social.name}
              name={social.name}
              username={profile[social.name] as string}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
