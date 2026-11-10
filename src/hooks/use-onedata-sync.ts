"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@/services/interceptors";
import {
  useApiServiceGetApiV1ProfileKey,
  useApiServicePostApiV1ProfileOnedataSync,
} from "../../openapi/queries";
import {
  ApiError,
  OnedataSyncResponse,
  PaginatedProfileList,
} from "../../openapi/requests";

export const ONEDATA_SYNC_MUTATION_KEY = ["onedata-sync"];

export type SyncOutcome =
  | { kind: "response"; status: 200 | 400 | 502; body: OnedataSyncResponse }
  | { kind: "unauthorized" }
  | { kind: "network" };

function toOutcome(error: unknown): SyncOutcome {
  if (!(error instanceof ApiError)) return { kind: "network" };
  if (error.status === 401) return { kind: "unauthorized" };
  const body = error.body;
  if (
    (error.status === 400 || error.status === 502) &&
    typeof body === "object" &&
    body !== null &&
    "enabled" in body
  ) {
    return { kind: "response", status: error.status, body: body as OnedataSyncResponse };
  }
  return { kind: "network" };
}

/**
 * The only place that calls onedata-sync (background poller, the profile button and onboarding).
 * sync() refreshes the access token first, never throws and shows no toasts; the caller decides what to show.
 * A dry run only checks the Onedata account and changes nothing.
 */
export function useOnedataSync() {
  const queryClient = useQueryClient();
  const { update } = useSession();
  // update() changes with every session change, sync() must stay stable
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  }, [update]);
  const { mutateAsync } = useApiServicePostApiV1ProfileOnedataSync({
    mutationKey: ONEDATA_SYNC_MUTATION_KEY,
  });
  const isSyncing = useIsMutating({ mutationKey: ONEDATA_SYNC_MUTATION_KEY }) > 0;

  const sync = useCallback(
    async ({ force = false, dryRun = false }: { force?: boolean; dryRun?: boolean } = {}): Promise<SyncOutcome> => {
      // a stale token must not be reported as "no Onedata account"
      const fresh = await updateRef.current().catch(() => null);
      if (fresh?.accessToken) setAccessToken(fresh.accessToken);
      let outcome: SyncOutcome;
      try {
        const body = await mutateAsync({ requestBody: { force, dry_run: dryRun } });
        outcome = { kind: "response", status: 200, body };
      } catch (error) {
        outcome = toOutcome(error);
      }
      if (outcome.kind === "response" && !dryRun) {
        // the status lives on the profile, update every cached profile page without refetching
        const { onedata_user_id, onedata_last_sync_at, onedata_last_sync_error } = outcome.body;
        // read before the patch below overwrites the cached id
        const cachedIds = queryClient
          .getQueriesData<PaginatedProfileList>({ queryKey: [useApiServiceGetApiV1ProfileKey] })
          .flatMap(([, data]) => data?.results?.map((profile) => profile.onedata_user_id) ?? []);
        const idChanged = cachedIds.length === 0 || cachedIds.some((id) => id !== onedata_user_id);
        queryClient.setQueriesData<PaginatedProfileList>(
          { queryKey: [useApiServiceGetApiV1ProfileKey] },
          (data) =>
            data && {
              ...data,
              results: data.results?.map((profile) => ({
                ...profile,
                onedata_user_id,
                onedata_last_sync_at,
                onedata_last_sync_error,
              })),
            }
        );
        // a new link changes fields the response lacks (onedata_access_allowed, onedata_linked_at);
        // an unchanged id (the every-minute poll) needs no refetch of the expensive profile
        if (outcome.status === 200 && idChanged) {
          await queryClient.invalidateQueries({ queryKey: [useApiServiceGetApiV1ProfileKey] });
        }
      }
      return outcome;
    },
    [mutateAsync, queryClient]
  );

  return { sync, isSyncing };
}
