// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { ApiService, DataciteApiService, OnedataApiService } from "../requests/services.gen";
import { Dataset, Experiment, Facility, Group, Instrument, PatchedDataset, PatchedExperiment, PatchedFacility, PatchedGroup, PatchedInstrument, PatchedProfile, PatchedProject, PatchedSchema, PatchedUser, Profile, Project, Schema, User } from "../requests/types.gen";
import * as Common from "./common";
export const useApiServiceGetApiSchema = <TData = Common.ApiServiceGetApiSchemaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ format, lang }: {
  format?: "json" | "yaml";
  lang?: "af" | "ar" | "ar-dz" | "ast" | "az" | "be" | "bg" | "bn" | "br" | "bs" | "ca" | "ckb" | "cs" | "cy" | "da" | "de" | "dsb" | "el" | "en" | "en-au" | "en-gb" | "eo" | "es" | "es-ar" | "es-co" | "es-mx" | "es-ni" | "es-ve" | "et" | "eu" | "fa" | "fi" | "fr" | "fy" | "ga" | "gd" | "gl" | "he" | "hi" | "hr" | "hsb" | "hu" | "hy" | "ia" | "id" | "ig" | "io" | "is" | "it" | "ja" | "ka" | "kab" | "kk" | "km" | "kn" | "ko" | "ky" | "lb" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "my" | "nb" | "ne" | "nl" | "nn" | "os" | "pa" | "pl" | "pt" | "pt-br" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sr-latn" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "tk" | "tr" | "tt" | "udm" | "uk" | "ur" | "uz" | "vi" | "zh-hans" | "zh-hant";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiSchemaKeyFn({ format, lang }, queryKey), queryFn: () => ApiService.getApiSchema({ format, lang }) as TData, ...options });
export const useApiServiceGetApiV1Datasets = <TData = Common.ApiServiceGetApiV1DatasetsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page, project }: {
  page?: number;
  project?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsKeyFn({ page, project }, queryKey), queryFn: () => ApiService.getApiV1Datasets({ page, project }) as TData, ...options });
export const useApiServiceGetApiV1DatasetsById = <TData = Common.ApiServiceGetApiV1DatasetsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1DatasetsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1DatasetsByIdGetByReservationId = <TData = Common.ApiServiceGetApiV1DatasetsByIdGetByReservationIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdGetByReservationIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1DatasetsByIdGetByReservationId({ id }) as TData, ...options });
export const useApiServiceGetApiV1Experiments = <TData = Common.ApiServiceGetApiV1ExperimentsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ExperimentsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Experiments({ page }) as TData, ...options });
export const useApiServiceGetApiV1ExperimentsById = <TData = Common.ApiServiceGetApiV1ExperimentsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ExperimentsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ExperimentsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Facilities = <TData = Common.ApiServiceGetApiV1FacilitiesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1FacilitiesKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Facilities({ page }) as TData, ...options });
export const useApiServiceGetApiV1FacilitiesById = <TData = Common.ApiServiceGetApiV1FacilitiesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1FacilitiesByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1FacilitiesById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Groups = <TData = Common.ApiServiceGetApiV1GroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1GroupsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Groups({ page }) as TData, ...options });
export const useApiServiceGetApiV1GroupsById = <TData = Common.ApiServiceGetApiV1GroupsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1GroupsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1GroupsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Instrument = <TData = Common.ApiServiceGetApiV1InstrumentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Instrument({ page }) as TData, ...options });
export const useApiServiceGetApiV1InstrumentById = <TData = Common.ApiServiceGetApiV1InstrumentByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1InstrumentById({ id }) as TData, ...options });
export const useApiServiceGetApiV1InstrumentMetadata = <TData = Common.ApiServiceGetApiV1InstrumentMetadataDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1InstrumentMetadataKeyFn(queryKey), queryFn: () => ApiService.getApiV1InstrumentMetadata() as TData, ...options });
export const useApiServiceGetApiV1Profile = <TData = Common.ApiServiceGetApiV1ProfileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProfileKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Profile({ page }) as TData, ...options });
export const useApiServiceGetApiV1ProfileById = <TData = Common.ApiServiceGetApiV1ProfileByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProfileByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ProfileById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Projects = <TData = Common.ApiServiceGetApiV1ProjectsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProjectsKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Projects({ page }) as TData, ...options });
export const useApiServiceGetApiV1ProjectsById = <TData = Common.ApiServiceGetApiV1ProjectsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ProjectsByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ProjectsById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Reservation = <TData = Common.ApiServiceGetApiV1ReservationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFrom, dateTo }: {
  dateFrom: string;
  dateTo: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ReservationKeyFn({ dateFrom, dateTo }, queryKey), queryFn: () => ApiService.getApiV1Reservation({ dateFrom, dateTo }) as TData, ...options });
export const useApiServiceGetApiV1ReservationById = <TData = Common.ApiServiceGetApiV1ReservationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1ReservationByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1ReservationById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Schemas = <TData = Common.ApiServiceGetApiV1SchemasDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1SchemasKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Schemas({ page }) as TData, ...options });
export const useApiServiceGetApiV1SchemasById = <TData = Common.ApiServiceGetApiV1SchemasByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1SchemasByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1SchemasById({ id }) as TData, ...options });
export const useApiServiceGetApiV1Users = <TData = Common.ApiServiceGetApiV1UsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ page }: {
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1UsersKeyFn({ page }, queryKey), queryFn: () => ApiService.getApiV1Users({ page }) as TData, ...options });
export const useApiServiceGetApiV1UsersById = <TData = Common.ApiServiceGetApiV1UsersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApiServiceGetApiV1UsersByIdKeyFn({ id }, queryKey), queryFn: () => ApiService.getApiV1UsersById({ id }) as TData, ...options });
export const useDataciteApiServiceGetDataciteApiV1Dois = <TData = Common.DataciteApiServiceGetDataciteApiV1DoisDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataciteApiServiceGetDataciteApiV1DoisKeyFn(queryKey), queryFn: () => DataciteApiService.getDataciteApiV1Dois() as TData, ...options });
export const useOnedataApiServiceGetOnedataApiV1Files = <TData = Common.OnedataApiServiceGetOnedataApiV1FilesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOnedataApiServiceGetOnedataApiV1FilesKeyFn(queryKey), queryFn: () => OnedataApiService.getOnedataApiV1Files() as TData, ...options });
export const useApiServicePostApiTokenLogin = <TData = Common.ApiServicePostApiTokenLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => ApiService.postApiTokenLogin() as unknown as Promise<TData>, ...options });
export const useApiServicePostApiTokenLogout = <TData = Common.ApiServicePostApiTokenLogoutMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => ApiService.postApiTokenLogout() as unknown as Promise<TData>, ...options });
export const useApiServicePostApiTokenLogoutall = <TData = Common.ApiServicePostApiTokenLogoutallMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => ApiService.postApiTokenLogoutall() as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Datasets = <TData = Common.ApiServicePostApiV1DatasetsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Datasets({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1DatasetsCreateDataset = <TData = Common.ApiServicePostApiV1DatasetsCreateDatasetMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1DatasetsCreateDataset({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1DatasetsCreateOnedataFolder = <TData = Common.ApiServicePostApiV1DatasetsCreateOnedataFolderMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1DatasetsCreateOnedataFolder({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1DatasetsCreatePublicShare = <TData = Common.ApiServicePostApiV1DatasetsCreatePublicShareMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1DatasetsCreatePublicShare({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1DatasetsShadow = <TData = Common.ApiServicePostApiV1DatasetsShadowMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1DatasetsShadow({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Experiments = <TData = Common.ApiServicePostApiV1ExperimentsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Experiment;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Experiment;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Experiments({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Facilities = <TData = Common.ApiServicePostApiV1FacilitiesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Facility;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Facility;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Facilities({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Groups = <TData = Common.ApiServicePostApiV1GroupsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Group;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Group;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Groups({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Instrument = <TData = Common.ApiServicePostApiV1InstrumentMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Instrument;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Instrument;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Instrument({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Profile = <TData = Common.ApiServicePostApiV1ProfileMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: Profile;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: Profile;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Profile({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Projects = <TData = Common.ApiServicePostApiV1ProjectsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Project;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Project;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Projects({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Schemas = <TData = Common.ApiServicePostApiV1SchemasMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: Schema;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: Schema;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Schemas({ requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1TempTokenById = <TData = Common.ApiServicePostApiV1TempTokenByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.postApiV1TempTokenById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServicePostApiV1Users = <TData = Common.ApiServicePostApiV1UsersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: User;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: User;
}, TContext>({ mutationFn: ({ requestBody }) => ApiService.postApiV1Users({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDataciteApiServicePostDataciteApiV1Dois = <TData = Common.DataciteApiServicePostDataciteApiV1DoisMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => DataciteApiService.postDataciteApiV1Dois() as unknown as Promise<TData>, ...options });
export const useOnedataApiServicePostOnedataApiV1Files = <TData = Common.OnedataApiServicePostOnedataApiV1FilesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => OnedataApiService.postOnedataApiV1Files() as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1DatasetsById = <TData = Common.ApiServicePutApiV1DatasetsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Dataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Dataset;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1DatasetsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1ExperimentsById = <TData = Common.ApiServicePutApiV1ExperimentsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Experiment;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Experiment;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1ExperimentsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1FacilitiesById = <TData = Common.ApiServicePutApiV1FacilitiesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Facility;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Facility;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1FacilitiesById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1GroupsById = <TData = Common.ApiServicePutApiV1GroupsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: Group;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: Group;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1GroupsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1InstrumentById = <TData = Common.ApiServicePutApiV1InstrumentByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Instrument;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Instrument;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1InstrumentById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1ProfileById = <TData = Common.ApiServicePutApiV1ProfileByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: Profile;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: Profile;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1ProfileById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1ProjectsById = <TData = Common.ApiServicePutApiV1ProjectsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Project;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Project;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1ProjectsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1SchemasById = <TData = Common.ApiServicePutApiV1SchemasByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Schema;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Schema;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1SchemasById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePutApiV1UsersById = <TData = Common.ApiServicePutApiV1UsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: User;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: User;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.putApiV1UsersById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataciteApiServicePutDataciteApiV1Dois = <TData = Common.DataciteApiServicePutDataciteApiV1DoisMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => DataciteApiService.putDataciteApiV1Dois() as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1DatasetsById = <TData = Common.ApiServicePatchApiV1DatasetsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedDataset;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedDataset;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1DatasetsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1ExperimentsById = <TData = Common.ApiServicePatchApiV1ExperimentsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedExperiment;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedExperiment;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1ExperimentsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1FacilitiesById = <TData = Common.ApiServicePatchApiV1FacilitiesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedFacility;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedFacility;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1FacilitiesById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1GroupsById = <TData = Common.ApiServicePatchApiV1GroupsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody?: PatchedGroup;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody?: PatchedGroup;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1GroupsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1InstrumentById = <TData = Common.ApiServicePatchApiV1InstrumentByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedInstrument;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedInstrument;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1InstrumentById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1ProfileById = <TData = Common.ApiServicePatchApiV1ProfileByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedProfile;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedProfile;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1ProfileById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1ProjectsById = <TData = Common.ApiServicePatchApiV1ProjectsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedProject;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedProject;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1ProjectsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1SchemasById = <TData = Common.ApiServicePatchApiV1SchemasByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: PatchedSchema;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: PatchedSchema;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1SchemasById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServicePatchApiV1UsersById = <TData = Common.ApiServicePatchApiV1UsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody?: PatchedUser;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody?: PatchedUser;
}, TContext>({ mutationFn: ({ id, requestBody }) => ApiService.patchApiV1UsersById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1DatasetsById = <TData = Common.ApiServiceDeleteApiV1DatasetsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1DatasetsById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1ExperimentsById = <TData = Common.ApiServiceDeleteApiV1ExperimentsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1ExperimentsById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1FacilitiesById = <TData = Common.ApiServiceDeleteApiV1FacilitiesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1FacilitiesById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1GroupsById = <TData = Common.ApiServiceDeleteApiV1GroupsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1GroupsById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1InstrumentById = <TData = Common.ApiServiceDeleteApiV1InstrumentByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1InstrumentById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1ProfileById = <TData = Common.ApiServiceDeleteApiV1ProfileByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1ProfileById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1ProjectsById = <TData = Common.ApiServiceDeleteApiV1ProjectsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1ProjectsById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1SchemasById = <TData = Common.ApiServiceDeleteApiV1SchemasByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1SchemasById({ id }) as unknown as Promise<TData>, ...options });
export const useApiServiceDeleteApiV1UsersById = <TData = Common.ApiServiceDeleteApiV1UsersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => ApiService.deleteApiV1UsersById({ id }) as unknown as Promise<TData>, ...options });
export const useDataciteApiServiceDeleteDataciteApiV1Dois = <TData = Common.DataciteApiServiceDeleteDataciteApiV1DoisMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => DataciteApiService.deleteDataciteApiV1Dois() as unknown as Promise<TData>, ...options });
