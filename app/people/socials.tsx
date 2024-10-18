"use client";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
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
      <svg fill="currentColor" viewBox="0 0 24 24" className={props.className}>
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
        className={props.className}
        fill="currentColor"
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
      <svg fill="currentColor" viewBox="0 0 24 24" className={props.className}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
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
    icon: (props: { className: string }) => (
      <LinkIcon className={props.className} />
    ),
  },
  {
    name: "Discord",
    icon: (props: { className: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        className={props.className}
      >
        <g>
          <path
            d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
            fill="#5865F2"
            fill-rule="nonzero"
          ></path>
        </g>
      </svg>
    ),
  },
];

function SocialLink(props: { name: string; username: string }) {
  const { name, username } = props;
  const social = SOCIALS.find((social) => social.name === name);
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
    const [copySuccess, setCopySuccess] = useState<string>("");
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(username);
        setCopySuccess("Copied username!");
      } catch (err) {
        setCopySuccess("Failed to copy!");
      }
    };

    return (
      <div className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
        <social.icon className="h-5 w-5" />
        <button onClick={copyToClipboard}>Copy Text</button>
        {copySuccess && <p>{copySuccess}</p>}
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
