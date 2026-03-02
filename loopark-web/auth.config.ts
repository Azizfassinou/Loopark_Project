import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAppRoute = nextUrl.pathname.startsWith("/app");
            if (isAppRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === "/login") {
                return Response.redirect(new URL("/app/search", nextUrl));
            }
            return true;
        },
    },
    providers: [], // Empty for now, will be added in auth.ts
} satisfies NextAuthConfig;
