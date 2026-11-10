"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/hooks/UserProfileContext";

const ONBOARDING_PATH = "/onboarding";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

/**
 * Users without a linked Onedata account only get to /onboarding (ONEDATA_REQUIRED on the server).
 * The rule itself lives on the server, in profile.onedata_access_allowed.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const profile = useUserProfile();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isOnboardingPage = pathname === ONBOARDING_PATH;
  const allowed = profile?.onedata_access_allowed;

  useEffect(() => {
    if (isLoginPage) return;
    if (allowed === false && !isOnboardingPage) router.replace(ONBOARDING_PATH);
    if (allowed === true && isOnboardingPage) router.replace("/");
  }, [allowed, isLoginPage, isOnboardingPage, router]);

  if (isLoginPage) return <>{children}</>;
  // no children until the profile is known, so no data queries fire for a gated user
  if (!profile || (allowed === false && !isOnboardingPage)) return <FullPageSpinner />;
  return <>{children}</>;
}
