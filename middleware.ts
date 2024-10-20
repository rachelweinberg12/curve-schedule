import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkPublishableKey, clerkSecretKey } from "./utils/clerk-config";

const isPrivateRout = createRouteMatcher(["/add-session-form(.*)"]);

export default clerkMiddleware(
  (auth, request) => {
    if (isPrivateRout(request)) {
      auth().protect();
    }
  },
  {
    publishableKey: clerkPublishableKey,
    secretKey: clerkSecretKey,
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
