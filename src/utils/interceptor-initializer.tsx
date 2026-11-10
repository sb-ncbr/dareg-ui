"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/services/interceptors";

export function InterceptorInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.accessToken);
  }, [session?.accessToken]);

  return null;
}
