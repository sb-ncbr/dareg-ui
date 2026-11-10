import { OpenAPI } from "../../openapi/requests";

// read on every request, so a logout or user switch never leaves an old token attached
let currentAccessToken: string | undefined;
let installed = false;

export const setAccessToken = (token?: string) => {
  currentAccessToken = token;
};

/**
 * The API answers 403 {code: "onedata_not_linked"} to users without a linked Onedata account.
 * Sends them to onboarding; returns true when the caller should drop the response (no error toast).
 */
export const redirectIfOnedataNotLinked = (status?: number, data?: unknown): boolean => {
  if (
    status !== 403 ||
    typeof data !== "object" ||
    data === null ||
    (data as { code?: unknown }).code !== "onedata_not_linked" ||
    typeof window === "undefined" ||
    window.location.pathname === "/onboarding"
  ) {
    return false;
  }
  window.location.assign("/onboarding");
  return true;
};

// never settles, so callers show no error while the browser navigates to onboarding
export const pendingForever = () => new Promise<never>(() => {});

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
  OpenAPI.interceptors.response.use(async (response) =>
    redirectIfOnedataNotLinked(response.status, response.data) ? pendingForever() : response
  );
};
