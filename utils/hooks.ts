import { Metadata } from "@/db/auth";
import { useUser } from "@clerk/nextjs";
import { useEffect, useLayoutEffect, useState } from "react";

export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useSafeLayoutEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenWidth;
};

export function useUserRecordID() {
  const useUserReturn = useUser();
  const userRecordID = useUserReturn.user?.publicMetadata.record_id;
  return userRecordID as string | undefined;
}

export function useUserMetadata() {
  const useUserReturn = useUser();
  const userMetadata = useUserReturn.user?.publicMetadata;
  return userMetadata as Metadata | undefined;
}

export function useUserSlug() {
  const useUserReturn = useUser();
  const userSlug = useUserReturn.user?.publicMetadata.slug;
  return userSlug as string | undefined;
}

const isServer = typeof window === "undefined";
export const useLocalStorage = <type>(initialValue: type, key?: string) => {
  const [state, setState] = useState<type>(initialValue);

  const initialize = () => {
    try {
      const initialValueString = JSON.stringify(initialValue);
      const value = key ? window.localStorage.getItem(key) : initialValueString;
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  };

  useEffect(() => {
    if (!isServer) {
      setValue(initialize());
    }
  }, []);

  const setValue = (value: type) => {
    try {
      setState(value);
      if (typeof window !== "undefined" && key) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { value: state, setValue };
};

export function clearLocalStorageItem(key: string) {
  window.localStorage.removeItem(key);
}
