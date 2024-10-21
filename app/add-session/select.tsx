import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type Option = {
  value: string;
  available: boolean;
  helperText?: string;
};
export function MyListbox(props: {
  options: Option[];
  currValue?: string;
  setCurrValue: (value: string) => void;
  placeholder: string;
}) {
  const { options, currValue, setCurrValue, placeholder } = props;
  const currOption = options.find((option) => option.value === currValue);
  return (
    <Listbox value={currValue} onChange={setCurrValue}>
      <div className="relative mt-1">
        <Listbox.Button className="h-12 rounded-md border px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 focus:outline-none relative border-gray-500 w-full cursor-pointer focus:ring-2 focus:ring-orange-500 focus:outline-0 focus:border-none bg-gray-800 py-2 pl-3 pr-10 text-left">
          {currValue ? (
            <span className="text-white truncate flex items-center justify-between">
              {currValue}
              {currOption?.helperText && (
                <span className="inline text-xs text-gray-400 truncate">
                  {currOption.helperText}
                </span>
              )}
            </span>
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-72 overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {options.map((option) => {
              return (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-pointer select-none py-2 pl-10 pr-4 z-10 disabled:text-gray-400 disabled:cursor-default",
                      active
                        ? "bg-orange-900 text-orange-100"
                        : "text-white bg-gray-800"
                    )
                  }
                  disabled={!option.available}
                >
                  {({ selected, disabled }) => (
                    <>
                      <span
                        className={clsx(
                          "flex items-end justify-between truncate",
                          selected ? "font-medium" : "font-normal",
                          disabled ? "text-gray-400" : "text-white"
                        )}
                      >
                        {option.value}
                        {option.helperText && (
                          <span className="inline text-xs text-gray-400 truncate">
                            {option.helperText}
                          </span>
                        )}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
