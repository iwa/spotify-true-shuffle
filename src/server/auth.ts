import { type GetServerSidePropsContext } from "next";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        jwt({ token, account, session }) {
            if (account) {
                token = Object.assign({}, token, { access_token: account.access_token });
            }
            return token;
        },
        session: ({ session, token, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
            accessToken: token.access_token,
        }),
    },
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID || '',
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
            authorization: 'https://accounts.spotify.com/authorize?scope=playlist-read-private,playlist-read-collaborative,user-modify-playback-state,user-read-playback-state'
        }),
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
