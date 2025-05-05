// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ApiService, DataciteApiService, OnedataApiService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseApiServiceGetApiSchemaData = (queryClient: QueryClient, { format, lang }: {
  format?: "json" | "yaml";
  lang?: "af" | "ar" | "ar-dz" | "ast" | "az" | "be" | "bg" | "bn" | "br" | "bs" | "ca" | "ckb" | "cs" | "cy" | "da" | "de" | "dsb" | "el" | "en" | "en-au" | "en-gb" | "eo" | "es" | "es-ar" | "es-co" | "es-mx" | "es-ni" | "es-ve" | "et" | "eu" | "fa" | "fi" | "fr" | "fy" | "ga" | "gd" | "gl" | "he" | "hi" | "hr" | "hsb" | "hu" | "hy" | "ia" | "id" | "ig" | "io" | "is" | "it" | "ja" | "ka" | "kab" | "kk" | "km" | "kn" | "ko" | "ky" | "lb" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "my" | "nb" | "ne" | "nl" | "nn" | "os" | "pa" | "pl" | "pt" | "pt-br" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sr-latn" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "tk" | "tr" | "tt" | "udm" | "uk" | "ur" | "uz" | "vi" | "zh-hans" | "zh-hant";
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiSchemaKeyFn({ format, lang }), queryFn: () => ApiService.getApiSchema({ format, lang }) });
export const ensureUseApiServiceGetApiV1DatasetsData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1DatasetsKeyFn({ page }), queryFn: () => ApiService.getApiV1Datasets({ page }) });
export const ensureUseApiServiceGetApiV1DatasetsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1DatasetsById({ id }) });
export const ensureUseApiServiceGetApiV1DatasetsByIdGetByReservationIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1DatasetsByIdGetByReservationIdKeyFn({ id }), queryFn: () => ApiService.getApiV1DatasetsByIdGetByReservationId({ id }) });
export const ensureUseApiServiceGetApiV1ExperimentsData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ExperimentsKeyFn({ page }), queryFn: () => ApiService.getApiV1Experiments({ page }) });
export const ensureUseApiServiceGetApiV1ExperimentsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ExperimentsByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1ExperimentsById({ id }) });
export const ensureUseApiServiceGetApiV1FacilitiesData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1FacilitiesKeyFn({ page }), queryFn: () => ApiService.getApiV1Facilities({ page }) });
export const ensureUseApiServiceGetApiV1FacilitiesByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1FacilitiesByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1FacilitiesById({ id }) });
export const ensureUseApiServiceGetApiV1GroupsData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1GroupsKeyFn({ page }), queryFn: () => ApiService.getApiV1Groups({ page }) });
export const ensureUseApiServiceGetApiV1GroupsByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1GroupsByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1GroupsById({ id }) });
export const ensureUseApiServiceGetApiV1InstrumentData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1InstrumentKeyFn({ page }), queryFn: () => ApiService.getApiV1Instrument({ page }) });
export const ensureUseApiServiceGetApiV1InstrumentByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1InstrumentByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1InstrumentById({ id }) });
export const ensureUseApiServiceGetApiV1InstrumentMetadataData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1InstrumentMetadataKeyFn(), queryFn: () => ApiService.getApiV1InstrumentMetadata() });
export const ensureUseApiServiceGetApiV1ProfileData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ProfileKeyFn({ page }), queryFn: () => ApiService.getApiV1Profile({ page }) });
export const ensureUseApiServiceGetApiV1ProfileByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ProfileByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1ProfileById({ id }) });
export const ensureUseApiServiceGetApiV1ProjectsData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ProjectsKeyFn({ page }), queryFn: () => ApiService.getApiV1Projects({ page }) });
export const ensureUseApiServiceGetApiV1ProjectsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ProjectsByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1ProjectsById({ id }) });
export const ensureUseApiServiceGetApiV1ReservationData = (queryClient: QueryClient, { dateFrom, dateTo }: {
  dateFrom: string;
  dateTo: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ReservationKeyFn({ dateFrom, dateTo }), queryFn: () => ApiService.getApiV1Reservation({ dateFrom, dateTo }) });
export const ensureUseApiServiceGetApiV1ReservationByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1ReservationByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1ReservationById({ id }) });
export const ensureUseApiServiceGetApiV1SchemasData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1SchemasKeyFn({ page }), queryFn: () => ApiService.getApiV1Schemas({ page }) });
export const ensureUseApiServiceGetApiV1SchemasByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1SchemasByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1SchemasById({ id }) });
export const ensureUseApiServiceGetApiV1UsersData = (queryClient: QueryClient, { page }: {
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1UsersKeyFn({ page }), queryFn: () => ApiService.getApiV1Users({ page }) });
export const ensureUseApiServiceGetApiV1UsersByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseApiServiceGetApiV1UsersByIdKeyFn({ id }), queryFn: () => ApiService.getApiV1UsersById({ id }) });
export const ensureUseDataciteApiServiceGetDataciteApiV1DoisData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDataciteApiServiceGetDataciteApiV1DoisKeyFn(), queryFn: () => DataciteApiService.getDataciteApiV1Dois() });
export const ensureUseOnedataApiServiceGetOnedataApiV1FilesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseOnedataApiServiceGetOnedataApiV1FilesKeyFn(), queryFn: () => OnedataApiService.getOnedataApiV1Files() });
