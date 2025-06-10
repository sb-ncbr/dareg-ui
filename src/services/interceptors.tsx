import { OpenAPI } from "../../openapi/requests";

export const setupInterceptors = (accessToken?: string) => {
  OpenAPI.interceptors.request.use(async (config) => {
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  });
};
