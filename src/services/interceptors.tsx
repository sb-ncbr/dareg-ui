import { OpenAPI } from "../../openapi/requests";

// read on every request, so a logout or user switch never leaves an old token attached
let currentAccessToken: string | undefined;
let installed = false;

export const setAccessToken = (token?: string) => {
  currentAccessToken = token;
};

export const setupInterceptors = () => {
  if (installed) return;
  installed = true;
  OpenAPI.interceptors.request.use(async (config) => {
    if (currentAccessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${currentAccessToken}`,
      };
    }
    return config;
  });
};
