// --- TYPE DEFINITIONS ---

export type Operator = "=" | "!=" | "<" | ">" | "<=" | ">=" | "contains" | "regex";
export type InputType = "number" | "string" | "date" | "boolean";

export interface FilterOption {
    key: string;
    label: string;
    inputType: InputType;
    min?: number;
    max?: number;
    inputTypeOverride?: InputType; // Allows overriding input type for specific use cases
    labelOverride?: string; // Allows overriding label for specific use cases
    dataSourceKey?: string;
    apiField?: string;
}

export interface ModelConfig {
    label: string;
    apiModel: string;
    filters: FilterOption[];
    trigramSearchFields?: readonly string[];
}

export interface Token {
    model: string;
    field: string;
    operator: Operator;
    value: string | number | Date | boolean | { from?: Date | string; to?: Date | string };
    displayValue: string;
    apiField?: string;
}

export interface SearchHistoryEntry {
    tokens: Token[];
    freeTextQuery?: string;
}

// --- CONFIGURATION & CONSTANTS ---

export const DEFAULT_DATE_RANGE = {
  from: new Date("1000-01-01"),
  to: new Date("9999-12-31"),
};


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

type FieldOverrides = Record<string, Partial<FilterOption>>;
interface ModelConfigOverrides {
    displayName: string;
    apiModel: string;
    trigramSearchFields?: readonly string[];
    fieldOverrides?: FieldOverrides;
}

const MODEL_CONFIG: Record<string, ModelConfigOverrides> = {
    Collections: {
        displayName: "Collections",
        apiModel: "project",
        trigramSearchFields: ["name", "description"] as const,
        fieldOverrides: {
            name: { dataSourceKey: "collections" },
        }
    },
    Datasets: {
        displayName: "Datasets",
        apiModel: "Dataset",
        trigramSearchFields: ["name", "description", "metadata.title"] as const,
        fieldOverrides: {
            name: { dataSourceKey: "datasets" },
            project: { dataSourceKey: "projects" },
        }
    },
    Templates: {
        displayName: "Templates",
        apiModel: "schema",
        trigramSearchFields: ["name", "description"] as const,
        fieldOverrides: {
            name: { dataSourceKey: "templates" },
        }
    },
};

// Fields to exclude from auto-generation
const EXCLUDED_FIELDS = ['id', 'deleted_at', '__v', '_id', 'metadata'];

// --- HELPER FUNCTIONS ---

function inferFieldType(fieldName: string): InputType {
    const lower = fieldName.toLowerCase();
    
    if (lower.includes('date') || lower.includes('_at') || lower.includes('time')) return "date";
    if (lower.includes('id') || lower.includes('count') || lower.includes('year') || lower.includes('size')) return "number";
    if (lower.startsWith('is_') || lower.startsWith('has_') || lower.includes('active') || lower.includes('enabled')) return "boolean";
    
    return "string";
}

function formatLabel(fieldName: string): string {
    const parts = fieldName.split('.');
    const lastPart = parts[parts.length - 1];
    
    const label = lastPart
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    if (parts.length > 1 && parts[0] === 'metadata') {
        return `Metadata: ${label}`;
    }
    return label;
}

// --- RUNTIME INITIALIZATION & ENRICHMENT ---

export let MODEL_MAP: Record<string, ModelConfig> = {};

/**
 * Initializes the MODEL_MAP from a parsed OpenAPI schema.
 * This is called once on application startup.
 */
export function initializeSearchModelsFromSchema(parsedSchema: Record<string, Array<{ key: string; inputType: string }>>): void {
    const newModelMap: Record<string, ModelConfig> = {};

    for (const key in MODEL_CONFIG) {
        const modelKey = key as keyof typeof MODEL_CONFIG;
        const config = MODEL_CONFIG[modelKey];
        const schemaFields = parsedSchema[modelKey];

        if (!schemaFields) {
            console.warn(`[Search] No schema fields found for model "${modelKey}".`);
            continue;
        }

        const filters: FilterOption[] = schemaFields
            .filter(field => !EXCLUDED_FIELDS.includes(field.key))
            .map(field => {
                const override = (config.fieldOverrides?.[field.key] ?? {}) as Partial<FilterOption>;
                return {
                    key: field.key,
                    label: override.label || formatLabel(field.key),
                    inputType: (override.inputType as InputType) || (field.inputType as InputType),
                    ...override
                };
            });

        newModelMap[modelKey] = {
            label: config.displayName,
            apiModel: config.apiModel,
            trigramSearchFields: config.trigramSearchFields,
            filters: filters.sort((a, b) => a.label.localeCompare(b.label))
        };
    }

    MODEL_MAP = newModelMap;
    console.log("✅ Search models initialized from schema", MODEL_MAP);
}

/**
 * Dynamically adds metadata fields to the Datasets model from live search results.
 * This can be called after any search that returns datasets to enrich the filter options.
 */
export function enrichModelMapWithDynamicMetadata(datasets: any[]): void {
    const datasetModel = MODEL_MAP.Datasets;
    if (!datasetModel || !Array.isArray(datasets) || datasets.length === 0) {
        return;
    }

    let fieldsAdded = 0;
    datasets.forEach(dataset => {
        if (!dataset?.metadata || typeof dataset.metadata !== 'object') return;

        Object.keys(dataset.metadata).forEach(metaKey => {
            const fullKey = `metadata.${metaKey}`;
            // If the filter doesn't already exist, add it.
            if (!datasetModel.filters.find(f => f.key === fullKey)) {
                datasetModel.filters.push({
                    key: fullKey,
                    label: formatLabel(fullKey),
                    inputType: inferFieldType(metaKey)
                });
                fieldsAdded++;
            }
        });
    });

    if (fieldsAdded > 0) {
        datasetModel.filters.sort((a, b) => a.label.localeCompare(b.label));
        console.log(`✅ Enriched Datasets with ${fieldsAdded} new dynamic metadata fields.`);
    }
}

// --- UTILITY EXPORTS ---

export function getApiField(modelKey: string, filterKey: string): string {
    const model = MODEL_MAP[modelKey];
    if (!model) return filterKey;
    const filter = model.filters.find(f => f.key === filterKey);
    return filter?.apiField || filter?.key || filterKey;
}

export function supportsTrigramSearch(modelKey: string, fieldKey: string): boolean {
    const model = MODEL_MAP[modelKey];
    return model?.trigramSearchFields?.includes(fieldKey) || false;
}

export function getApiModelName(modelKey: string): string {
    return MODEL_MAP[modelKey]?.apiModel || modelKey;
}