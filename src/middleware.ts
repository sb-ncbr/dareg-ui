import { auth } from "@/auth"
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "@/lib/routes";

// Debug: Log middleware execution
console.log("=== MIDDLEWARE DEBUG ===");
console.log("AUTH_SECRET available:", !!process.env.AUTH_SECRET, process.env.AUTH_SECRET?.length);
console.log("AUTH_SECRET:", process.env.AUTH_SECRET);
console.log("NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID:", process.env.NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID);
console.log("NEXT_PUBLIC_AUTH_OIDC_ISSUER:", process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT);
console.log("NEXT_PUBLIC_APP_OIDC_SCOPE:", process.env.NEXT_PUBLIC_APP_OIDC_SCOPE);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI);
console.log("NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT:", process.env.NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("APP_BASE_URL:", process.env.APP_BASE_URL);
console.log("APP_OIDC_REDIRECT_URL:", process.env.APP_OIDC_REDIRECT_URL);
console.log("APP_BASE_API_URL:", process.env.APP_BASE_API_URL);
console.log("APP_BASE_ONEZONE_URL:", process.env.APP_BASE_ONEZONE_URL);
console.log("APP_BASE_ONEZONE_PRETTY_URL:", process.env.APP_BASE_ONEZONE_PRETTY_URL);
console.log("PORT:", process.env.PORT);
console.log("APP_VERSION:", process.env.APP_VERSION);
console.log("APP_VERSION_DATE:", process.env.APP_VERSION_DATE);
console.log("APP_ENVIRONMENT:", process.env.APP_ENVIRONMENT);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("SECRET:", process.env.SECRET);
console.log("AUTH_TRUST_HOST:", process.env.AUTH_TRUST_HOST);
console.log("=== END MIDDLEWARE DEBUG ===");

export default auth((req) => {
    const { nextUrl } = req; 

    const isAuthenticated = !!req.auth;

    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (isPublicRoute && isAuthenticated) {
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }

    if (!isAuthenticated && !isPublicRoute) {
        return Response.redirect(new URL(ROOT, nextUrl));
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
