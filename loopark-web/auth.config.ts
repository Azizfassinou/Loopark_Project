import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAppRoute = nextUrl.pathname.startsWith("/app");
            const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

            if (isAppRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL("/app/search", nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
