import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Resetrict dashboard routes to signed in users
  if (isDashboardRoute(req)) auth().protect();

  // Restrict dashboard routes to signed-in users
  // if (isDashboardRoute(req)) {
  //   auth().protect();  // Enforce authentication
  // }
  // try
  // const { userId } = auth();

  // // Restrict dashboard routes to signed-in users
  // if (isDashboardRoute(req) && !userId) {
  //   return NextResponse.redirect("/sign-in"); // Redirect to sign-in page if not authenticated
  // }

  // // Allow the request to proceed
  // return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
