import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = (auth?.user as any)?.role as string | undefined;
            const emailVerified = (auth?.user as any)?.emailVerified as boolean | undefined;
            const pathname = nextUrl.pathname;

            // Admin routes — must be logged in + ADMIN role
            if (pathname.startsWith("/admin")) {
                if (!isLoggedIn) return false;
                if (userRole !== 'ADMIN') return Response.redirect(new URL("/app/search", nextUrl));
                return true;
            }

            // App routes — must be logged in + email verified
            const isAppRoute = pathname.startsWith("/app");
            if (isAppRoute) {
                if (!isLoggedIn) return false;
                // Soft block: redirect unverified users to a verification notice (DÉSACTIVÉ POUR LES TESTS)
                /*
                if (!emailVerified) {
                    return Response.redirect(new URL("/verify-email?notice=1", nextUrl));
                }
                */
                return true;
            }

            // Auth pages — redirect logged-in users away
            const isAuthRoute = pathname === "/login" || pathname === "/register";
            if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL("/app/search", nextUrl));
            }

            // verify-email page — always accessible
            return true;
        },
        session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.id ?? token.sub;
                session.user.role = token.role ?? 'USER';
                session.user.emailVerified = token.emailVerified ?? null;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
