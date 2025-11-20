import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiServiceCustom } from "../requests/custom";
import type { Job, WorkflowTemplate } from "../requests/types.gen";
import { Workflow } from "@/components/workflows/types/workflows";

// Keys
export const UseApiServiceGetApiV1WorkflowByEntityKeyFn = (
  { entity_type, entity_id }: { entity_type: 'project' | 'dataset' | 'experiment'; entity_id: string },
  extraKey?: unknown[]
) => ["/api/v1/workflow", entity_type, entity_id, ...(extraKey ?? [])];

export const UseApiServiceGetApiV1JobsByEntityKeyFn = (
  { entity_id }: { entity_id: string },
  extraKey?: unknown[]
) => ["/api/v1/jobs/entity", entity_id, ...(extraKey ?? [])];

// Queries
export const useApiServiceGetApiV1WorkflowByEntity = <
  TData = Workflow[],
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>({ entity_type, entity_id }: { entity_type: 'project' | 'dataset' | 'experiment'; entity_id: string }, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) =>
  useQuery<TData, TError>({
    queryKey: UseApiServiceGetApiV1WorkflowByEntityKeyFn({ entity_type, entity_id }, queryKey as unknown[]),
    queryFn: () => ApiServiceCustom.getApiV1WorkflowByEntity({ entity_type, entity_id }) as unknown as TData,
    ...options,
  });

export const useApiServiceGetApiV1JobsByEntity = <
  TData = Job[],
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>({ entity_id }: { entity_id: string }, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) =>
  useQuery<TData, TError>({
    queryKey: UseApiServiceGetApiV1JobsByEntityKeyFn({ entity_id }, queryKey as unknown[]),
    queryFn: () => ApiServiceCustom.getApiV1JobsByEntity({ entity_id }) as unknown as TData,
    ...options,
  });


