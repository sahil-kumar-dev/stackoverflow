import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/api/webhook',
    '/api/chatgpt',
    '/question/:id',
    '/tag/:id',
    '/profile/:id',
    '/community',
    '/jobs'
])

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect()
    }
});


export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)",
        '/(api|trpc)(.*)',

    ],
};