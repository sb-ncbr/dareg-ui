"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CircleAlert, CircleCheck, ExternalLink, Loader2, LogOut, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogout } from "@/hooks/use-logout";
import { SyncOutcome, useOnedataSync } from "@/hooks/use-onedata-sync";

const ONEDATA_URL = "https://onedata.e-infra.cz/";
const BUSY_RETRY_MS = 2000;

type State = "checking" | "found" | "no_account" | "unavailable" | "misconfigured" | "linking";

function stateOf(outcome: SyncOutcome): State | "busy" | "unauthorized" {
  if (outcome.kind === "network") return "unavailable";
  if (outcome.kind === "unauthorized") return "unauthorized";
  switch (outcome.body.reason) {
    case null:
      return "found";
    case "no_onedata_account":
      return "no_account";
    case "onedata_unavailable":
      return "unavailable";
    case "busy":
      return "busy";
    default: // not_oidc, auto_link_disabled
      return "misconfigured";
  }
}

const FAILURE_TOASTS: Partial<Record<State, string>> = {
  no_account: "Onedata did not find your account.",
  unavailable: "Onedata is temporarily unavailable.",
  misconfigured: "Your session can't be used to verify Onedata.",
};

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const logout = useLogout();
  const { sync } = useOnedataSync();
  const [state, setState] = useState<State>("checking");
  const [foundId, setFoundId] = useState("");
  const checkStarted = useRef(false);

  /** Calls onedata-sync, retries a busy result once, returns the resulting state (null = redirecting). */
  const run = useCallback(
    async (dryRun: boolean): Promise<State | null> => {
      let outcome = await sync({ dryRun });
      let next = stateOf(outcome);
      if (next === "busy") {
        await new Promise((resolve) => setTimeout(resolve, BUSY_RETRY_MS));
        outcome = await sync({ dryRun });
        next = stateOf(outcome);
      }
      if (next === "unauthorized") {
        // signing out also leaves the NextAuth session, otherwise /login sends the user back here
        void logout();
        return null;
      }
      setFoundId(outcome.kind === "response" ? outcome.body.found_onedata_user_id : "");
      return next === "busy" ? "unavailable" : next;
    },
    [sync, logout]
  );

  const check = useCallback(async () => {
    setState("checking");
    const next = await run(true);
    if (next) setState(next);
  }, [run]);

  const link = async () => {
    setState("linking");
    const next = await run(false);
    if (next === "found") {
      // useOnedataSync has already refetched the profile, so the gate lets the user in
      router.replace("/");
    } else if (next) {
      toast.error(`Your Onedata account could not be linked. ${FAILURE_TOASTS[next] ?? ""}`);
      setState(next);
    }
  };

  useEffect(() => {
    if (checkStarted.current) return; // React strict mode runs effects twice
    checkStarted.current = true;
    void check();
  }, [check]);

  const busy = state === "checking" || state === "linking";
  const identity = session?.user?.username || session?.user?.name;

  return (
    <Card className="mx-4 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">DAREG</CardTitle>
        <CardDescription>Link your OneData account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <p>
          DAREG stores experiment data in OneData (e-INFRA CZ). Access to your data is synchronised
          from DAREG to OneData, so DAREG needs to know your OneData account. Your OneData account is
          created automatically the first time you log in at OneData with your e-INFRA identity.
        </p>
        {identity && (
          <p>
            You are signed in to DAREG as <strong>{identity}</strong>.
          </p>
        )}

        <div className="rounded-md border p-4">
          {busy && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              {state === "checking" ? "Checking your OneData account…" : "Linking your OneData account…"}
            </div>
          )}
          {state === "found" && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-medium text-green-600">
                <CircleCheck className="h-5 w-5" />
                OneData account found
              </div>
              <code className="text-xs text-muted-foreground">{foundId}</code>
            </div>
          )}
          {state === "no_account" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-medium">
                <CircleAlert className="h-5 w-5 text-destructive" />
                No OneData account was found for your e-INFRA identity.
              </div>
              <p>
                <a
                  href={ONEDATA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open OneData <ExternalLink className="h-4 w-4" />
                </a>
                : Log in there with the same e-INFRA identity, then come back and click Check again.
              </p>
            </div>
          )}
          {state === "unavailable" && (
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-destructive" />
              OneData is temporarily unavailable. Please try again later.
            </div>
          )}
          {state === "misconfigured" && (
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-destructive" />
              Your session can&apos;t be used to verify OneData. Please log out and log in again.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <Button variant="ghost" onClick={() => void logout()}>
          <LogOut /> Log out
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void check()} disabled={busy}>
            <RefreshCw /> Check again
          </Button>
          <Button onClick={() => void link()} disabled={state !== "found"}>
            Link my OneData account and continue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
