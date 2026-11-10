"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@/services/interceptors";
import {
  ONEDATA_SYNC_MUTATION_KEY,
  SyncOutcome,
  useOnedataSync,
} from "@/hooks/use-onedata-sync";

const POLL_INTERVAL_MS = 60 * 1000;
const BACKOFF_INTERVAL_MS = 5 * 60 * 1000;
const VISIBLE_MIN_GAP_MS = 10 * 1000;

/** Delay before the next tick, null stops polling for this user. */
function nextDelay(outcome: SyncOutcome): number | null {
  if (outcome.kind === "network") return BACKOFF_INTERVAL_MS;
  if (outcome.kind === "unauthorized") return POLL_INTERVAL_MS;
  if (!outcome.body.enabled) return null;
  return outcome.status === 502 ? BACKOFF_INTERVAL_MS : POLL_INTERVAL_MS;
}

/**
 * Auto-link: keeps the user's Onedata group memberships in sync while DAREG is open
 * (also in a background tab). DAREG can join groups only with the user's own token,
 * which it sees only during API calls, so the UI polls. Silent, the profile page shows the status.
 */
export function OnedataAutoLink() {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const { sync } = useOnedataSync();
  // not derived from `status`: update() flips it to "loading" on every tick, which would restart
  // the loop and call update() again in an endless loop; session data stays set while loading
  // and becomes null on logout
  const username = session?.user?.username;

  // update() changes with every session change, the loop must not restart because of it
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    if (!username) return;
    let stopped = false;
    let running = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = POLL_INTERVAL_MS;
    let lastTickAt = 0;

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(tick, delay);
    };

    const tick = async () => {
      if (stopped || running) return;
      if (queryClient.isMutating({ mutationKey: ONEDATA_SYNC_MUTATION_KEY }) > 0) {
        schedule();
        return;
      }
      running = true;
      lastTickAt = Date.now();
      clearTimeout(timer);
      try {
        // refetching the session refreshes an expired access token (also in a background tab)
        const fresh = await updateRef.current().catch(() => null);
        if (stopped) return;
        if (fresh?.accessToken && fresh.user?.username === username) {
          setAccessToken(fresh.accessToken);
          const outcome = await sync({ force: false });
          if (stopped) return; // a late response for a previous user is ignored
          const next = nextDelay(outcome);
          if (next === null) {
            stopped = true; // auto-link is disabled on the server
            return;
          }
          delay = next;
        }
        schedule();
      } finally {
        running = false;
      }
    };

    const onVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastTickAt > VISIBLE_MIN_GAP_MS
      ) {
        void tick();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    void tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [username, queryClient, sync]);

  return null;
}
