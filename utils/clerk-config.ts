const isDevelopment = process.env.NODE_ENV === "development";

export const clerkPublishableKey = isDevelopment
  ? process.env.NEXT_PUBLIC_CLERK_DEV_PUBLISHABLE_KEY
  : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const clerkSecretKey = isDevelopment
  ? process.env.CLERK_DEV_SECRET_KEY
  : process.env.CLERK_SECRET_KEY;
