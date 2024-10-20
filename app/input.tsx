/* eslint-disable react/display-name */
import clsx from "clsx";
import { Ref, forwardRef } from "react";

export const Input = forwardRef(
  (
    props: {
      error?: boolean;
      errorMessage?: string;
    } & JSX.IntrinsicElements["input"],
    ref: Ref<HTMLInputElement>
  ) => {
    const { error, errorMessage, className, ...rest } = props;
    return (
      <>
        <input
          ref={ref}
          className={clsx(
            "h-12 rounded-md border bg-gray-800 px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 invalid:placeholder-red-300 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-900 disabled:text-gray-500",
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" // matches invalid: styles
              : "border-gray-500 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-0 focus:border-none",
            className
          )}
          {...rest}
        />
        {error && errorMessage && (
          <span className="text-xs text-red-500">{errorMessage}</span>
        )}
      </>
    );
  }
);

export const Textarea = forwardRef(
  (props: JSX.IntrinsicElements["textarea"], ref: Ref<HTMLTextAreaElement>) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "rounded-md text-sm resize-none h-24 border bg-white px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 invalid:placeholder-red-300 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-0 focus:border-none",
          props.className
        )}
        {...props}
      />
    );
  }
);
