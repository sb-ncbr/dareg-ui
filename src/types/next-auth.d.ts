import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Auth {
        session?: Session;
    }
    
    interface Session {
        user: {
            id: string;
            username: string;
            name: string;
            email: string;
        } & DefaultSession["user"];
        accessToken?: string; // ✅ Add accessToken to session
    }

    interface User extends DefaultUser {
        username: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        username: string;
        accessToken?: string; // ✅ Add accessToken to JWT
    }
}
