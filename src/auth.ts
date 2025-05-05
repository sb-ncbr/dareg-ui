import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        {
            id: 'einfracz',
            name: 'EInfraCZ',
            type: 'oidc',
            issuer: process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER,
            clientId: process.env.NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID,
            client: {
                token_endpoint_auth_method: 'none',
            },
            wellKnown: `${process.env.NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER}/.well-known/openid-configuration`, // Well-known configuration URL
            authorization: {
                url: process.env.NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT,
                params: {
                    scope: process.env.NEXT_PUBLIC_APP_OIDC_SCOPE,
                },
            },

            token: process.env.NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT,
            userinfo: process.env.NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT,
            profile(profile) {
                console.log('User logged in', { userId: profile.sub });
                return {
                    id: profile.sub,
                    username: profile.sub?.toLowerCase(),
                    name: `${profile.given_name} ${profile.family_name}`,
                    email: profile.email,
                };
            },
        },
    ],
    debug: true, // Enable debug mode for detailed logs
    pages: {
        error: '/login', // Redirect to login page on error
        signIn: '/projects', // Redirect to login page for sign-in
        signOut: '/login', // Redirect to login page after sign-out
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.username = token.username;
            session.accessToken = token.accessToken;
            return session;
        },
    }
});