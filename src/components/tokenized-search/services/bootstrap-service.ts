import { initializeSearchModelsFromSchema } from "@/components/tokenized-search/types/search-models";
import { apiClient } from "@/utils/api-client";

const SCHEMA_MODEL_MAPPING = {
  Collections: "ProjectResponse",
  Datasets: "DatasetResponse",
  Templates: "Schema",
};

function inferInputTypeFromSchema(schemaProperty: any): string | null {
  const { type, format, items } = schemaProperty || {};

  if (type === "object") return null;
  if (type === "array") {
    const itemType = items?.type;
    if (!itemType || itemType === "object" || itemType === "array") return null;
  }

  if (format === "date-time" || format === "date") return "date";
  if (type === "boolean") return "boolean";
  if (type === "integer" || type === "number") return "number";

  if (type === "string" || !type) return "string";

  return null;
}

export async function bootstrapSearchModels() {
  console.log("Bootstrapping search models from OpenAPI schema...");

  try {
    const response = await apiClient.instance.get("/api/schema/", {
      timeout: 30000,
    });
    const schema = response.data;

    if (!schema?.components?.schemas) {
      throw new Error(
        "Invalid OpenAPI schema format received from the server."
      );
    }

    const allSchemaComponents = schema.components.schemas;
    const parsedSchemaFields: Record<
      string,
      Array<{ key: string; inputType: string }>
    > = {};

    for (const [modelKey, schemaName] of Object.entries(SCHEMA_MODEL_MAPPING)) {
      const modelSchema = allSchemaComponents[schemaName];
      if (!modelSchema?.properties) {
        console.warn(
          `Schema for "${schemaName}" not found. Skipping model "${modelKey}".`
        );
        continue;
      }

      parsedSchemaFields[modelKey] = Object.keys(modelSchema.properties)
        .map((fieldName) => {
          const propertyDetails = modelSchema.properties[fieldName];
          const inputType = inferInputTypeFromSchema(propertyDetails);
          if (!inputType) return null;
          return {
            key: fieldName,
            inputType,
          };
        })
        .filter(Boolean) as Array<{ key: string; inputType: string }>;
    }

    initializeSearchModelsFromSchema(parsedSchemaFields);
  } catch (error) {
    console.error(
      "FATAL: Failed to bootstrap search models from schema. Search may be disabled.",
      error
    );
  }
}
