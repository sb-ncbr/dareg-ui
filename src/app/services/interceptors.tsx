import { getSession } from "next-auth/react";
import {OpenAPI} from "../../../openapi/requests";

export const setupInterceptors = () => {
    OpenAPI.interceptors.request.use(async (config) => {
        const session = await getSession(); // Fetch the session dynamically
        if (session?.accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${session.accessToken}`,
            };
        }
        return config;
    });
};