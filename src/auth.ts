import NextAuth from "next-auth";

const REFRESH_MARGIN = 60 * 1000;

async function refreshAccessToken(token : any) {
    try {
        const url = process.env.NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT!;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

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
            wellKnown: `${process.env.NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER}/.well-known/openid-configuration`,
            authorization: {
                url: process.env.NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT,
                params: {
                    scope: process.env.NEXT_PUBLIC_APP_OIDC_SCOPE,
                    prompt: "consent",
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
    debug: true,
    pages: {
        error: '/login',
        signIn: '/collections',
        signOut: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at
                    ? account.expires_at * 1000
                    : Date.now() + (account.expires_in ?? 3600) * 1000;
            }
            if (user) {
                token.username = user.username;
            }

            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires - REFRESH_MARGIN
            ) {
                return token;
            }
        
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.id = session.user.id;
            session.user.username = token.username;
            session.accessToken = token.accessToken;
            return session;
        },
    }
});
