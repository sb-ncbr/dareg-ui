"use client";

import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { setAccessToken } from "@/services/interceptors";

/** Drops the API token and all cached data of the current user before signing out. */
export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    setAccessToken(undefined);
    queryClient.clear();
    return signOut({ callbackUrl: "/login" });
  };
}
