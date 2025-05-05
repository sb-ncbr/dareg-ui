// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { ApiService, DataciteApiService, OnedataApiService } from "../requests/services.gen";
export type ApiServiceGetApiSchemaDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiSchema>>;
export type ApiServiceGetApiSchemaQueryResult<TData = ApiServiceGetApiSchemaDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiSchemaKey = "ApiServiceGetApiSchema";
export const UseApiServiceGetApiSchemaKeyFn = ({ format, lang }: {
  format?: "json" | "yaml";
  lang?: "af" | "ar" | "ar-dz" | "ast" | "az" | "be" | "bg" | "bn" | "br" | "bs" | "ca" | "ckb" | "cs" | "cy" | "da" | "de" | "dsb" | "el" | "en" | "en-au" | "en-gb" | "eo" | "es" | "es-ar" | "es-co" | "es-mx" | "es-ni" | "es-ve" | "et" | "eu" | "fa" | "fi" | "fr" | "fy" | "ga" | "gd" | "gl" | "he" | "hi" | "hr" | "hsb" | "hu" | "hy" | "ia" | "id" | "ig" | "io" | "is" | "it" | "ja" | "ka" | "kab" | "kk" | "km" | "kn" | "ko" | "ky" | "lb" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "my" | "nb" | "ne" | "nl" | "nn" | "os" | "pa" | "pl" | "pt" | "pt-br" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sr-latn" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "tk" | "tr" | "tt" | "udm" | "uk" | "ur" | "uz" | "vi" | "zh-hans" | "zh-hant";
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiSchemaKey, ...(queryKey ?? [{ format, lang }])];
export type ApiServiceGetApiV1DatasetsDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Datasets>>;
export type ApiServiceGetApiV1DatasetsQueryResult<TData = ApiServiceGetApiV1DatasetsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1DatasetsKey = "ApiServiceGetApiV1Datasets";
export const UseApiServiceGetApiV1DatasetsKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1DatasetsKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1DatasetsByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1DatasetsById>>;
export type ApiServiceGetApiV1DatasetsByIdQueryResult<TData = ApiServiceGetApiV1DatasetsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1DatasetsByIdKey = "ApiServiceGetApiV1DatasetsById";
export const UseApiServiceGetApiV1DatasetsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1DatasetsByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1DatasetsByIdGetByReservationIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1DatasetsByIdGetByReservationId>>;
export type ApiServiceGetApiV1DatasetsByIdGetByReservationIdQueryResult<TData = ApiServiceGetApiV1DatasetsByIdGetByReservationIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1DatasetsByIdGetByReservationIdKey = "ApiServiceGetApiV1DatasetsByIdGetByReservationId";
export const UseApiServiceGetApiV1DatasetsByIdGetByReservationIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1DatasetsByIdGetByReservationIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1ExperimentsDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Experiments>>;
export type ApiServiceGetApiV1ExperimentsQueryResult<TData = ApiServiceGetApiV1ExperimentsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ExperimentsKey = "ApiServiceGetApiV1Experiments";
export const UseApiServiceGetApiV1ExperimentsKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ExperimentsKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1ExperimentsByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1ExperimentsById>>;
export type ApiServiceGetApiV1ExperimentsByIdQueryResult<TData = ApiServiceGetApiV1ExperimentsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ExperimentsByIdKey = "ApiServiceGetApiV1ExperimentsById";
export const UseApiServiceGetApiV1ExperimentsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ExperimentsByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1FacilitiesDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Facilities>>;
export type ApiServiceGetApiV1FacilitiesQueryResult<TData = ApiServiceGetApiV1FacilitiesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1FacilitiesKey = "ApiServiceGetApiV1Facilities";
export const UseApiServiceGetApiV1FacilitiesKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1FacilitiesKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1FacilitiesByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1FacilitiesById>>;
export type ApiServiceGetApiV1FacilitiesByIdQueryResult<TData = ApiServiceGetApiV1FacilitiesByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1FacilitiesByIdKey = "ApiServiceGetApiV1FacilitiesById";
export const UseApiServiceGetApiV1FacilitiesByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1FacilitiesByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1GroupsDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Groups>>;
export type ApiServiceGetApiV1GroupsQueryResult<TData = ApiServiceGetApiV1GroupsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1GroupsKey = "ApiServiceGetApiV1Groups";
export const UseApiServiceGetApiV1GroupsKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1GroupsKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1GroupsByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1GroupsById>>;
export type ApiServiceGetApiV1GroupsByIdQueryResult<TData = ApiServiceGetApiV1GroupsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1GroupsByIdKey = "ApiServiceGetApiV1GroupsById";
export const UseApiServiceGetApiV1GroupsByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1GroupsByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1InstrumentDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Instrument>>;
export type ApiServiceGetApiV1InstrumentQueryResult<TData = ApiServiceGetApiV1InstrumentDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1InstrumentKey = "ApiServiceGetApiV1Instrument";
export const UseApiServiceGetApiV1InstrumentKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1InstrumentKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1InstrumentByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1InstrumentById>>;
export type ApiServiceGetApiV1InstrumentByIdQueryResult<TData = ApiServiceGetApiV1InstrumentByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1InstrumentByIdKey = "ApiServiceGetApiV1InstrumentById";
export const UseApiServiceGetApiV1InstrumentByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1InstrumentByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1InstrumentMetadataDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1InstrumentMetadata>>;
export type ApiServiceGetApiV1InstrumentMetadataQueryResult<TData = ApiServiceGetApiV1InstrumentMetadataDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1InstrumentMetadataKey = "ApiServiceGetApiV1InstrumentMetadata";
export const UseApiServiceGetApiV1InstrumentMetadataKeyFn = (queryKey?: Array<unknown>) => [useApiServiceGetApiV1InstrumentMetadataKey, ...(queryKey ?? [])];
export type ApiServiceGetApiV1ProfileDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Profile>>;
export type ApiServiceGetApiV1ProfileQueryResult<TData = ApiServiceGetApiV1ProfileDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ProfileKey = "ApiServiceGetApiV1Profile";
export const UseApiServiceGetApiV1ProfileKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ProfileKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1ProfileByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1ProfileById>>;
export type ApiServiceGetApiV1ProfileByIdQueryResult<TData = ApiServiceGetApiV1ProfileByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ProfileByIdKey = "ApiServiceGetApiV1ProfileById";
export const UseApiServiceGetApiV1ProfileByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ProfileByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1ProjectsDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Projects>>;
export type ApiServiceGetApiV1ProjectsQueryResult<TData = ApiServiceGetApiV1ProjectsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ProjectsKey = "ApiServiceGetApiV1Projects";
export const UseApiServiceGetApiV1ProjectsKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ProjectsKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1ProjectsByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1ProjectsById>>;
export type ApiServiceGetApiV1ProjectsByIdQueryResult<TData = ApiServiceGetApiV1ProjectsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ProjectsByIdKey = "ApiServiceGetApiV1ProjectsById";
export const UseApiServiceGetApiV1ProjectsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ProjectsByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1ReservationDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Reservation>>;
export type ApiServiceGetApiV1ReservationQueryResult<TData = ApiServiceGetApiV1ReservationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ReservationKey = "ApiServiceGetApiV1Reservation";
export const UseApiServiceGetApiV1ReservationKeyFn = ({ dateFrom, dateTo }: {
  dateFrom: string;
  dateTo: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ReservationKey, ...(queryKey ?? [{ dateFrom, dateTo }])];
export type ApiServiceGetApiV1ReservationByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1ReservationById>>;
export type ApiServiceGetApiV1ReservationByIdQueryResult<TData = ApiServiceGetApiV1ReservationByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1ReservationByIdKey = "ApiServiceGetApiV1ReservationById";
export const UseApiServiceGetApiV1ReservationByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1ReservationByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1SchemasDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Schemas>>;
export type ApiServiceGetApiV1SchemasQueryResult<TData = ApiServiceGetApiV1SchemasDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1SchemasKey = "ApiServiceGetApiV1Schemas";
export const UseApiServiceGetApiV1SchemasKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1SchemasKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1SchemasByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1SchemasById>>;
export type ApiServiceGetApiV1SchemasByIdQueryResult<TData = ApiServiceGetApiV1SchemasByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1SchemasByIdKey = "ApiServiceGetApiV1SchemasById";
export const UseApiServiceGetApiV1SchemasByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1SchemasByIdKey, ...(queryKey ?? [{ id }])];
export type ApiServiceGetApiV1UsersDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1Users>>;
export type ApiServiceGetApiV1UsersQueryResult<TData = ApiServiceGetApiV1UsersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1UsersKey = "ApiServiceGetApiV1Users";
export const UseApiServiceGetApiV1UsersKeyFn = ({ page }: {
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1UsersKey, ...(queryKey ?? [{ page }])];
export type ApiServiceGetApiV1UsersByIdDefaultResponse = Awaited<ReturnType<typeof ApiService.getApiV1UsersById>>;
export type ApiServiceGetApiV1UsersByIdQueryResult<TData = ApiServiceGetApiV1UsersByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApiServiceGetApiV1UsersByIdKey = "ApiServiceGetApiV1UsersById";
export const UseApiServiceGetApiV1UsersByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useApiServiceGetApiV1UsersByIdKey, ...(queryKey ?? [{ id }])];
export type DataciteApiServiceGetDataciteApiV1DoisDefaultResponse = Awaited<ReturnType<typeof DataciteApiService.getDataciteApiV1Dois>>;
export type DataciteApiServiceGetDataciteApiV1DoisQueryResult<TData = DataciteApiServiceGetDataciteApiV1DoisDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataciteApiServiceGetDataciteApiV1DoisKey = "DataciteApiServiceGetDataciteApiV1Dois";
export const UseDataciteApiServiceGetDataciteApiV1DoisKeyFn = (queryKey?: Array<unknown>) => [useDataciteApiServiceGetDataciteApiV1DoisKey, ...(queryKey ?? [])];
export type OnedataApiServiceGetOnedataApiV1FilesDefaultResponse = Awaited<ReturnType<typeof OnedataApiService.getOnedataApiV1Files>>;
export type OnedataApiServiceGetOnedataApiV1FilesQueryResult<TData = OnedataApiServiceGetOnedataApiV1FilesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOnedataApiServiceGetOnedataApiV1FilesKey = "OnedataApiServiceGetOnedataApiV1Files";
export const UseOnedataApiServiceGetOnedataApiV1FilesKeyFn = (queryKey?: Array<unknown>) => [useOnedataApiServiceGetOnedataApiV1FilesKey, ...(queryKey ?? [])];
export type ApiServicePostApiTokenLoginMutationResult = Awaited<ReturnType<typeof ApiService.postApiTokenLogin>>;
export type ApiServicePostApiTokenLogoutMutationResult = Awaited<ReturnType<typeof ApiService.postApiTokenLogout>>;
export type ApiServicePostApiTokenLogoutallMutationResult = Awaited<ReturnType<typeof ApiService.postApiTokenLogoutall>>;
export type ApiServicePostApiV1DatasetsMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Datasets>>;
export type ApiServicePostApiV1DatasetsCreateDatasetMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1DatasetsCreateDataset>>;
export type ApiServicePostApiV1DatasetsCreateOnedataFolderMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1DatasetsCreateOnedataFolder>>;
export type ApiServicePostApiV1DatasetsCreatePublicShareMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1DatasetsCreatePublicShare>>;
export type ApiServicePostApiV1DatasetsShadowMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1DatasetsShadow>>;
export type ApiServicePostApiV1ExperimentsMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Experiments>>;
export type ApiServicePostApiV1FacilitiesMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Facilities>>;
export type ApiServicePostApiV1GroupsMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Groups>>;
export type ApiServicePostApiV1InstrumentMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Instrument>>;
export type ApiServicePostApiV1ProfileMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Profile>>;
export type ApiServicePostApiV1ProjectsMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Projects>>;
export type ApiServicePostApiV1SchemasMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Schemas>>;
export type ApiServicePostApiV1TempTokenByIdMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1TempTokenById>>;
export type ApiServicePostApiV1UsersMutationResult = Awaited<ReturnType<typeof ApiService.postApiV1Users>>;
export type DataciteApiServicePostDataciteApiV1DoisMutationResult = Awaited<ReturnType<typeof DataciteApiService.postDataciteApiV1Dois>>;
export type OnedataApiServicePostOnedataApiV1FilesMutationResult = Awaited<ReturnType<typeof OnedataApiService.postOnedataApiV1Files>>;
export type ApiServicePutApiV1DatasetsByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1DatasetsById>>;
export type ApiServicePutApiV1ExperimentsByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1ExperimentsById>>;
export type ApiServicePutApiV1FacilitiesByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1FacilitiesById>>;
export type ApiServicePutApiV1GroupsByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1GroupsById>>;
export type ApiServicePutApiV1InstrumentByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1InstrumentById>>;
export type ApiServicePutApiV1ProfileByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1ProfileById>>;
export type ApiServicePutApiV1ProjectsByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1ProjectsById>>;
export type ApiServicePutApiV1SchemasByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1SchemasById>>;
export type ApiServicePutApiV1UsersByIdMutationResult = Awaited<ReturnType<typeof ApiService.putApiV1UsersById>>;
export type DataciteApiServicePutDataciteApiV1DoisMutationResult = Awaited<ReturnType<typeof DataciteApiService.putDataciteApiV1Dois>>;
export type ApiServicePatchApiV1DatasetsByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1DatasetsById>>;
export type ApiServicePatchApiV1ExperimentsByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1ExperimentsById>>;
export type ApiServicePatchApiV1FacilitiesByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1FacilitiesById>>;
export type ApiServicePatchApiV1GroupsByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1GroupsById>>;
export type ApiServicePatchApiV1InstrumentByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1InstrumentById>>;
export type ApiServicePatchApiV1ProfileByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1ProfileById>>;
export type ApiServicePatchApiV1ProjectsByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1ProjectsById>>;
export type ApiServicePatchApiV1SchemasByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1SchemasById>>;
export type ApiServicePatchApiV1UsersByIdMutationResult = Awaited<ReturnType<typeof ApiService.patchApiV1UsersById>>;
export type ApiServiceDeleteApiV1DatasetsByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1DatasetsById>>;
export type ApiServiceDeleteApiV1ExperimentsByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1ExperimentsById>>;
export type ApiServiceDeleteApiV1FacilitiesByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1FacilitiesById>>;
export type ApiServiceDeleteApiV1GroupsByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1GroupsById>>;
export type ApiServiceDeleteApiV1InstrumentByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1InstrumentById>>;
export type ApiServiceDeleteApiV1ProfileByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1ProfileById>>;
export type ApiServiceDeleteApiV1ProjectsByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1ProjectsById>>;
export type ApiServiceDeleteApiV1SchemasByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1SchemasById>>;
export type ApiServiceDeleteApiV1UsersByIdMutationResult = Awaited<ReturnType<typeof ApiService.deleteApiV1UsersById>>;
export type DataciteApiServiceDeleteDataciteApiV1DoisMutationResult = Awaited<ReturnType<typeof DataciteApiService.deleteDataciteApiV1Dois>>;
