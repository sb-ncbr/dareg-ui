"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setupInterceptors } from "@/services/interceptors";

export function InterceptorInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    setupInterceptors(session?.accessToken);
  }, [session?.accessToken]);

  return null;
}
