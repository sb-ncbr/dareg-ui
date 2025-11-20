/**
 * Django ContentType mapping utilities
 *
 * Django uses ContentType IDs (integers) to reference different model types.
 * These IDs are database primary keys that map to specific models.
 *
 * NOTE: These ContentType IDs must match your Django backend's database.
 * You can find these by:
 * 1. Running in Django shell: ContentType.objects.filter(model__in=['project', 'dataset', 'experiment'])
 * 2. Checking your Django admin panel at /admin/contenttypes/contenttype/
 * 3. Making a test API call and inspecting existing job records
 *
 * TODO: Replace these placeholder IDs with actual IDs from your Django backend
 */

export type EntityType = "project" | "dataset" | "experiment";

/**
 * Content Type ID mapping
 * Values from Django database: contenttypes_contenttype table
 *
 * NOTE: While Project has a ContentType, Django backend validation does NOT allow
 * Project as an output_resource. Only Dataset and Experiment are valid for output_resource.
 */
export const CONTENT_TYPE_IDS: Record<EntityType, number> = {
  project: 11, // ContentType ID for Project model (used for root_resource only)
  dataset: 15, // ContentType ID for Dataset model (can be used for output_resource)
  experiment: 17, // ContentType ID for Experiment model (can be used for output_resource)
};

/**
 * Convert entity type string to Django ContentType ID
 * @param entityType - The entity type ('project', 'dataset', or 'experiment')
 * @returns The ContentType ID (integer) or null if invalid
 */
export function getContentTypeId(entityType?: string): number | null {
  if (!entityType) return null;

  const normalizedType = entityType.toLowerCase() as EntityType;

  if (normalizedType in CONTENT_TYPE_IDS) {
    return CONTENT_TYPE_IDS[normalizedType];
  }

  console.warn(`Unknown entity type: ${entityType}`);
  return null;
}

/**
 * Reverse mapping: ContentType ID to entity type string
 * Values from Django database: contenttypes_contenttype table
 */
export const CONTENT_TYPE_ID_TO_ENTITY: Record<number, EntityType> = {
  11: "project",
  15: "dataset",
  17: "experiment",
};

/**
 * Convert Django ContentType ID back to entity type string
 * @param contentTypeId - The ContentType ID
 * @returns The entity type string or null if unknown
 */
export function getEntityTypeFromContentTypeId(
  contentTypeId?: number | null
): EntityType | null {
  if (contentTypeId === null || contentTypeId === undefined) return null;
  return CONTENT_TYPE_ID_TO_ENTITY[contentTypeId] || null;
}

/**
 * Check if an entity type is valid for output_resource
 * According to Django backend validation: Job output can only be related to Experiment or Dataset
 * @param entityType - The entity type to validate
 * @returns true if valid for output_resource, false otherwise
 */
export function isValidOutputResourceType(entityType?: string): boolean {
  if (!entityType) return false;
  // Backend validation: output_resource can ONLY be Dataset or Experiment, NOT Project
  return ["dataset", "experiment"].includes(entityType.toLowerCase());
}

/**
 * Validate if an entity type is valid for a given workflow type
 * @param workflowType - The workflow type
 * @param entityType - The entity type to validate
 * @returns true if valid, false otherwise
 */
export function isValidEntityTypeForWorkflow(
  workflowType: string,
  entityType?: string
): boolean {
  if (!entityType) return false;

  switch (workflowType) {
    case "WriteData":
      // WriteData workflows output - must be dataset or experiment only
      return isValidOutputResourceType(entityType);
    case "Readonly":
    case "In-placeChange":
    case "Export":
      // These workflows typically don't create output resources
      return true;
    default:
      return false;
  }
}
