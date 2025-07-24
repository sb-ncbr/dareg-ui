export type Operator = "=" | "!=" | "<" | ">" | "<=" | ">=" | "contains" | "regex";
export type InputType = "number" | "string" | "date" | "boolean";

export interface FilterOption {
    key: string; // This should be the actual API field path
    label: string; // Display name for UI
    inputType: InputType;
    dataSourceKey?: string; // For autocomplete data source
    apiField?: string; // Override API field if different from key
}

export interface ModelConfig {
    label: string;
    apiModel: string; // The actual model name for API calls
    filters: FilterOption[];
    trigramSearchFields?: string[]; // Fields that support trigram search
}

export interface Token {
    model: string;
    field: string;
    operator: Operator;
    value: string | number | Date | boolean;
    displayValue: string;
    apiField: string; // The actual API field path
}

// Mapping UI operators to API operators
export const API_OPERATOR_MAP: Record<Operator, string> = {
    "=": "$eq",
    "!=": "$ne",
    "<": "$lt",
    ">": "$gt",
    "<=": "$lte",
    ">=": "$gte",
    "contains": "$contains",
    "regex": "$regex",
};

// Model configurations based on the API documentation
export const MODEL_MAP: Record<string, ModelConfig> = {
    Collections: {
        label: "Collections",
        apiModel: "project", // Actual model name for API
        trigramSearchFields: ["name", "description"],
        filters: [
            {
                key: "name",
                label: "Collection Name",
                inputType: "string",
                dataSourceKey: "collections",
            },
            {
                key: "description",
                label: "Description",
                inputType: "string",
            },
            {
                key: "created_at",
                label: "Created At",
                inputType: "date",
            },
            {
                key: "owner_id",
                label: "Owner ID",
                inputType: "number",
            },
            // Metadata fields (assuming collections have metadata)
            {
                key: "metadata.project_type",
                label: "Project Type",
                inputType: "string",
            },
        ],
    },
    Datasets: {
        label: "Datasets",
        apiModel: "Dataset", // Actual model name for API
        trigramSearchFields: ["name", "description", "metadata.title"],
        filters: [
            {
                key: "name",
                label: "Dataset Name",
                inputType: "string",
                dataSourceKey: "datasets",
            },
            {
                key: "description",
                label: "Description",
                inputType: "string",
            },
            {
                key: "project",
                label: "Project/Collection",
                inputType: "string",
                dataSourceKey: "projects",
            },
            {
                key: "created_at",
                label: "Created At",
                inputType: "date",
            },
            {
                key: "status",
                label: "Status",
                inputType: "string",
                dataSourceKey: "datasets_statuses",
            },
            {
                key: "created_by",
                label: "Created By",
                inputType: "string",
            },
            {
                key: "tags",
                label: "Tags",
                inputType: "string",
            },
            // Metadata fields based on query.md examples
            {
                key: "metadata.title",
                label: "Metadata Title",
                inputType: "string",
            },
            {
                key: "metadata.publication_year",
                label: "Publication Year",
                inputType: "number",
            },
            {
                key: "metadata.project_type",
                label: "Project Type",
                inputType: "string",
            },
        ],
    },
    Templates: {
        label: "Templates",
        apiModel: "schema", // Actual model name for API
        trigramSearchFields: ["name", "description"],
        filters: [
            {
                key: "name",
                label: "Template Name",
                inputType: "string",
                dataSourceKey: "templates",
            },
            {
                key: "description",
                label: "Description",
                inputType: "string",
            },
            {
                key: "collection_id",
                label: "Collection ID",
                inputType: "number",
            },
            {
                key: "version",
                label: "Version",
                inputType: "string",
            },
            {
                key: "created_at",
                label: "Created At",
                inputType: "date",
            },
        ],
    },
};

// Helper function to get API field path
export function getApiField(modelKey: string, filterKey: string): string {
    const model = MODEL_MAP[modelKey];
    const filter = model?.filters.find(f => f.key === filterKey);
    return filter?.apiField || filter?.key || filterKey;
}

// Helper function to check if field supports trigram search
export function supportsTrigramSearch(modelKey: string, fieldKey: string): boolean {
    const model = MODEL_MAP[modelKey];
    return model?.trigramSearchFields?.includes(fieldKey) || false;
}

// Helper function to get API model name
export function getApiModelName(modelKey: string): string {
    return MODEL_MAP[modelKey]?.apiModel || modelKey;
}