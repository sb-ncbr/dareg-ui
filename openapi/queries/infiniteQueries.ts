// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { InfiniteData, UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { ApiService } from "../requests/services.gen";
import * as Common from "./common";
export const useApiServiceGetApiV1DatasetsInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1DatasetsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1DatasetsKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Datasets({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1ExperimentsInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1ExperimentsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1ExperimentsKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Experiments({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1FacilitiesInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1FacilitiesDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1FacilitiesKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Facilities({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1GroupsInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1GroupsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1GroupsKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Groups({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1InstrumentInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1InstrumentDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1InstrumentKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Instrument({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1ProfileInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1ProfileDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1ProfileKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Profile({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1ProjectsInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1ProjectsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1ProjectsKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Projects({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1SchemasInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1SchemasDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1SchemasKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Schemas({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useApiServiceGetApiV1UsersInfinite = <TData = InfiniteData<Common.ApiServiceGetApiV1UsersDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ }: {} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseApiServiceGetApiV1UsersKeyFn({}, queryKey), queryFn: ({ pageParam }) => ApiService.getApiV1Users({ page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
