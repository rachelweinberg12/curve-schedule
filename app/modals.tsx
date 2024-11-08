"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpTrayIcon, MapIcon } from "@heroicons/react/24/outline";

export function MapModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
        onClick={() => setOpen(true)}
      >
        <MapIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
      </button>
      <Modal open={open} setOpen={setOpen}>
        <Image
          src="/map.png"
          alt="Map"
          className="w-full h-full"
          width={500}
          height={500}
        />
      </Modal>
    </div>
  );
}

export function SessionModal(props: {
  open: boolean;
  close: () => void;
  sessionInfoDisplay?: React.ReactNode;
}) {
  const { open, close, sessionInfoDisplay } = props;
  return (
    <Modal open={open} setOpen={close} hideClose>
      {sessionInfoDisplay}
    </Modal>
  );
}

export function ExportScheduleModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
        onClick={() => setOpen(true)}
      >
        <ArrowUpTrayIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
      </button>
      <Modal open={open} setOpen={setOpen}>
        <h1 className="text-2xl font-bold">Export schedule</h1>
        <p className="mt-2">
          Add the schedule to an external calendar using any of the links below.
        </p>
        <div className="flex flex-col gap-4 mt-3 pl-4">
          <a
            href="https://calendar.google.com/calendar/u/0?cid=fo6ng9e5sji2mli6eisk5lctpk9eb8da@import.calendar.google.com"
            className="text-orange-500 hover:underline"
          >
            Google Calendar link
          </a>
          <a
            href="https://calendar.google.com/calendar/ical/fo6ng9e5sji2mli6eisk5lctpk9eb8da%40import.calendar.google.com/public/basic.ics"
            className="text-orange-500 hover:underline"
          >
            iCal link
          </a>
          <a
            href="https://calendar.google.com/calendar/embed?src=fo6ng9e5sji2mli6eisk5lctpk9eb8da%40import.calendar.google.com&ctz=America%2FLos_Angeles"
            className="text-orange-500 hover:underline"
          >
            Public generic link
          </a>
        </div>
      </Modal>
    </div>
  );
}

export function Modal(props: {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  hideClose?: boolean;
}) {
  const { open, setOpen, children, hideClose } = props;
  const fakeRef = useRef(null);
  return (
    <div className="bg-gray-800">
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          initialFocus={fakeRef}
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <button ref={fakeRef} className="hidden" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-full overflow-y-auto">
            <div className="flex min-h-full w-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative mb-10 transform overflow-visible rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  {children}
                  {!hideClose && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
