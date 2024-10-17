"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ExportScheduleModal, MapModal } from "./modals";
import { CONSTS, NavItem } from "@/utils/constants";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUserRecordID } from "@/utils/hooks";

export default function NavBar() {
  const user = useUserRecordID();
  const profileLink = `/${user}`;
  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-300 fixed w-full z-30"
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400">
                  <span className="absolute -inset-0.5" />
                  {open ? (
                    <XMarkIcon className="block h-6 w-6 stroke-2" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6 stroke-2" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center justify-between sm:justify-start w-full gap-3">
                  <Link
                    className="sm:text-2xl hidden sm:block font-bold mr-5"
                    href="/"
                  >
                    {CONSTS.TITLE}
                  </Link>
                  <div className="sm:hidden block ml-2">
                    <SignInSignUp />
                  </div>
                  <div className="flex gap-3 mr-14 sm:mr-0">
                    <MapModal />
                    <ExportScheduleModal />
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                  {/* Desktop nav */}
                  <div className="hidden sm:block">
                    <div className="flex space-x-4">
                      {CONSTS.NAV_ITEMS.map((item) => (
                        <NavBarItem key={item.name} item={item} />
                      ))}
                      <SignedIn>
                        {/* TODO: change /profile to /recordID */}
                        <NavBarItem
                          item={{ name: "Profile", href: profileLink }}
                        />
                      </SignedIn>
                      <SignInSignUp />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile nav */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {CONSTS.NAV_ITEMS.map((item) => (
                <SmallNavBarItem key={item.name} item={item} />
              ))}
              <SignedIn>
                {/* TODO: change /profile to /recordID */}
                <SmallNavBarItem
                  item={{ name: "Profile", href: profileLink }}
                />
              </SignedIn>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function NavBarItem(props: { item: NavItem }) {
  const { item } = props;
  const isCurrentPage = usePathname().includes(item.href) && item.href != null;
  return (
    <Link
      key={item.name}
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-50 text-rose-400"
          : "text-gray-400 hover:bg-gray-100",
        "group flex gap-1 cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium"
      )}
    >
      {item.name}
    </Link>
  );
}

function SmallNavBarItem(props: { item: NavItem }) {
  const { item } = props;
  const isCurrentPage = usePathname().includes(item.href) && item.href != null;
  return (
    <Disclosure.Button
      key={item.name}
      as="a"
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-50 text-rose-400"
          : "text-gray-400 hover:bg-gray-100",
        "flex gap-2 rounded-md px-3 py-2 text-base font-medium"
      )}
    >
      {item.name}
    </Disclosure.Button>
  );
}

const SignInSignUp = () => (
  <>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </>
);
