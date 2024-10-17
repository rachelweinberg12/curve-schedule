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
