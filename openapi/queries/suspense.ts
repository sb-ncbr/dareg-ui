// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ApiService, DataciteApiService, OnedataApiService } from "../requests/services.gen";
import * as Common from "./common";
export const useApiServiceGetApiSchemaSuspense = <TData = Common.ApiServiceGetApiSchemaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ format, lang }: {
  format?: "json" | "yaml";
  lang?: "af" | "ar" | "ar-dz" | "ast" | "az" | "be" | "bg" | "bn" | "br" | "bs" | "ca" | "ckb" | "cs" | "cy" | "da" | "de" | "dsb" | "el" | "en" | "en-au" | "en-gb" | "eo" | "es" | "es-ar" | "es-co" | "es-mx" | "es-ni" | "es-ve" | "et" | "eu" | "fa" | "fi" | "fr" | "fy" | "ga" | "gd" | "gl" | "he" | "hi" | "hr" | "hsb" | "hu" | "hy" | "ia" | "id" | "ig" | "io" | "is" | "it" | "ja" | "ka" | "kab" | "kk" | "km" | "kn" | "ko" | "ky" | "lb" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "my" | "nb" | "ne" | "nl" | "nn" | "os" | "pa" | "pl" | "pt" | "pt-br" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sr-latn" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "tk" | "tr" | "tt" | "udm" | "uk" | "ur" | "uz" | "vi" | "zh-hans" | "zh-hant";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiSchemaKeyFn({ format, lang }, queryKey), queryFn: () => ApiService.getApiSchema({ format, lang }) as TData, ...options });
export const useApiServiceGetApiV1DatasetsSuspense = <TData = Common.ApiServiceGetApiV1DatasetsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Datasets({ page }) as TData, ...options });
export const useApiServiceGetApiV1DatasetsByIdSuspense = <TData = Common.ApiServiceGetApiV1DatasetsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1DatasetsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1DatasetsByIdGetByReservationIdSuspense = <TData = Common.ApiServiceGetApiV1DatasetsByIdGetByReservationIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdGetByReservationIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1DatasetsByIdGetByReservationId({ id }) as TData, ...options });
export const useApiServiceGetApiV1ExperimentsSuspense = <TData = Common.ApiServiceGetApiV1ExperimentsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ExperimentsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Experiments({ page }) as TData, ...options });
export const useApiServiceGetApiV1ExperimentsByIdSuspense = <TData = Common.ApiServiceGetApiV1ExperimentsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ExperimentsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ExperimentsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1FacilitiesSuspense = <TData = Common.ApiServiceGetApiV1FacilitiesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1FacilitiesKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Facilities({ page }) as TData, ...options });
export const useApiServiceGetApiV1FacilitiesByIdSuspense = <TData = Common.ApiServiceGetApiV1FacilitiesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1FacilitiesByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1FacilitiesById({ id }) as TData, ...options });
export const useApiServiceGetApiV1GroupsSuspense = <TData = Common.ApiServiceGetApiV1GroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1GroupsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Groups({ page }) as TData, ...options });
export const useApiServiceGetApiV1GroupsByIdSuspense = <TData = Common.ApiServiceGetApiV1GroupsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1GroupsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1GroupsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1InstrumentSuspense = <TData = Common.ApiServiceGetApiV1InstrumentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Instrument({ page }) as TData, ...options });
export const useApiServiceGetApiV1InstrumentByIdSuspense = <TData = Common.ApiServiceGetApiV1InstrumentByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1InstrumentById({ id }) as TData, ...options });
export const useApiServiceGetApiV1InstrumentMetadataSuspense = <TData = Common.ApiServiceGetApiV1InstrumentMetadataDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentMetadataKeyFn(queryKey), queryFn: () => ApiService.getApiV1InstrumentMetadata() as TData, ...options });
export const useApiServiceGetApiV1ProfileSuspense = <TData = Common.ApiServiceGetApiV1ProfileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProfileKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Profile({ page }) as TData, ...options });
export const useApiServiceGetApiV1ProfileByIdSuspense = <TData = Common.ApiServiceGetApiV1ProfileByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProfileByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ProfileById({ id }) as TData, ...options });
export const useApiServiceGetApiV1ProjectsSuspense = <TData = Common.ApiServiceGetApiV1ProjectsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProjectsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Projects({ page }) as TData, ...options });
export const useApiServiceGetApiV1ProjectsByIdSuspense = <TData = Common.ApiServiceGetApiV1ProjectsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProjectsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ProjectsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1ReservationSuspense = <TData = Common.ApiServiceGetApiV1ReservationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFrom, dateTo }: {
  dateFrom: string;
  dateTo: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ReservationKeyFn({ dateFrom, dateTo }, queryKey), queryFn: () => ApiService.getApiV1Reservation({ dateFrom, dateTo }) as TData, ...options });
export const useApiServiceGetApiV1ReservationByIdSuspense = <TData = Common.ApiServiceGetApiV1ReservationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ReservationByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ReservationById({ id }) as TData, ...options });
export const useApiServiceGetApiV1SchemasSuspense = <TData = Common.ApiServiceGetApiV1SchemasDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1SchemasKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Schemas({ page }) as TData, ...options });
export const useApiServiceGetApiV1SchemasByIdSuspense = <TData = Common.ApiServiceGetApiV1SchemasByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1SchemasByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1SchemasById({ id }) as TData, ...options });
export const useApiServiceGetApiV1UsersSuspense = <TData = Common.ApiServiceGetApiV1UsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1UsersKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Users({ page }) as TData, ...options });
export const useApiServiceGetApiV1UsersByIdSuspense = <TData = Common.ApiServiceGetApiV1UsersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1UsersByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1UsersById({ id }) as TData, ...options });
export const useDataciteApiServiceGetDataciteApiV1DoisSuspense = <TData = Common.DataciteApiServiceGetDataciteApiV1DoisDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataciteApiServiceGetDataciteApiV1DoisKeyFn(queryKey), queryFn: () => DataciteApiService.getDataciteApiV1Dois() as TData, ...options });
export const useOnedataApiServiceGetOnedataApiV1FilesSuspense = <TData = Common.OnedataApiServiceGetOnedataApiV1FilesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOnedataApiServiceGetOnedataApiV1FilesKeyFn(queryKey), queryFn: () => OnedataApiService.getOnedataApiV1Files() as TData, ...options });
