import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ** Add the routes you want to protect here
const isProtectedRoute = createRouteMatcher([
  "/events/create",
  "/events/:id/update",
  "/events/:id/analytics",
  "/analytics",
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
