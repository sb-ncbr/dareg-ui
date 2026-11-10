"use client";

import { useCallback } from "react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
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
 * The only place that calls onedata-sync (background poller and the profile button).
 * sync() never throws and shows no toasts; the caller decides what to show.
 */
export function useOnedataSync() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useApiServicePostApiV1ProfileOnedataSync({
    mutationKey: ONEDATA_SYNC_MUTATION_KEY,
  });
  const isSyncing = useIsMutating({ mutationKey: ONEDATA_SYNC_MUTATION_KEY }) > 0;

  const sync = useCallback(
    async ({ force }: { force: boolean }): Promise<SyncOutcome> => {
      let outcome: SyncOutcome;
      try {
        const body = await mutateAsync({ requestBody: { force } });
        outcome = { kind: "response", status: 200, body };
      } catch (error) {
        outcome = toOutcome(error);
      }
      if (outcome.kind === "response") {
        // the status lives on the profile, update every cached profile page without refetching
        const { onedata_user_id, onedata_last_sync_at, onedata_last_sync_error } = outcome.body;
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
      }
      return outcome;
    },
    [mutateAsync, queryClient]
  );

  return { sync, isSyncing };
}
