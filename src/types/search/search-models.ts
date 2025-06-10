export type Operator = "=" | "!=" | "<" | ">" | "<=" | ">=";
export type InputType = "number" | "string" | "date";

export interface FilterOption {
    key: string;
    label: string;
    inputType: InputType;
    dataSourceKey?:
        | "projects"
        | "collections"
        | "templates"
        | "datasets_statuses";
}

export interface ModelConfig {
    label: string;
    endpoint: string;
    filters: FilterOption[];
}

export interface Token {
    model: string;
    field: string;
    operator: Operator;
    value: string | number | Date;
    displayValue: string;
}

export const MODEL_MAP: Record<string, ModelConfig> = {
    Collections: {
        label: "Collections",
        endpoint: "/api/v1/collections/",
        filters: [
            {
                key: "name",
                label: "Name",
                inputType: "string",
                dataSourceKey: "collections",
            },
            { key: "created_at", label: "Created At", inputType: "date" },
            { key: "owner_id", label: "Owner ID", inputType: "number" },
        ],
    },
    Datasets: {
        label: "Datasets",
        endpoint: "/api/v1/datasets/",
        filters: [
            {
                key: "project",
                label: "Collection",
                inputType: "string",
                dataSourceKey: "projects",
            },
            { key: "created_at", label: "Created At", inputType: "date" },
            { key: "status", label: "Status", inputType: "string" },
            {
                key: "dataset_name",
                label: "Dataset Name",
                inputType: "string",
                dataSourceKey: "datasets_statuses",
            },
            { key: "created_by", label: "Created By", inputType: "string" },
        ],
    },
    Templates: {
        label: "Templates",
        endpoint: "/api/v1/templates/",
        filters: [
            { key: "collection_id", label: "Collection ID", inputType: "number" },
            {
                key: "template_name",
                label: "Template Name",
                inputType: "string",
                dataSourceKey: "templates",
            },
            { key: "version", label: "Version", inputType: "string" },
        ],
    },
};