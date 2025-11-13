import NextAuth from "next-auth";

const REFRESH_MARGIN = 60 * 1000;

async function refreshAccessToken(token: any) {
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
        prompt: "consent",
        accessType: "offline",
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
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: true, // Enable debug in dev
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, JSON.stringify(metadata, null, 2));
    },
  },
  providers: [
    {
      id: "einfracz",
      name: "EInfraCZ",
      type: "oidc",
      issuer: process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER,
      clientId: process.env.NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID,
      client: {
        token_endpoint_auth_method: "none",
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
        console.log("OIDC Profile received:", profile);
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
    error: "/login",
    signIn: "/collections",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback - Account:", account ? "Present" : "Missing");
      console.log("JWT Callback - Token expires:", token.accessTokenExpires);

      // Initial sign in
      if (account && user) {
        console.log("Initial sign in - storing minimal token data");
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + (account.expires_in ?? 3600) * 1000,
          username: user.username,
          sub: token.sub,
          // Don't store large profile data or entitlements
        };
      }

      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number) - REFRESH_MARGIN
      ) {
        console.log("Token still valid, returning existing token");
        return token;
      }

      // Access token has expired, try to refresh it
      console.log("Token expired, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Only pass minimal necessary data to the session
      session.user.username = token.username as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
