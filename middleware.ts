import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkSecretKey } from "@/utils/clerk-config";

const isPrivateRout = createRouteMatcher(["/add-session-form(.*)"]);

export default clerkMiddleware(
  (auth, request) => {
    if (isPrivateRout(request)) {
      auth().protect();
    }
  },
  { secretKey: clerkSecretKey }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
