import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkPublishableKey, clerkSecretKey } from "./utils/clerk-config";

const isPrivateRoute = createRouteMatcher(["/add-session(.*)", "/people(.*)"]);

export default clerkMiddleware(
  (auth, request) => {
    if (isPrivateRoute(request)) {
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
