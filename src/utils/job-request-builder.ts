/**
 * Type-safe Job creation utilities
 *
 * These types ensure that job creation requests match the OpenAPI specification
 * and use proper Django ContentType IDs (integers) instead of strings.
 */

import type { Job } from "@/openapi/requests/types.gen";
import { getContentTypeId, type EntityType } from "./content-type-mapper";

/**
 * Job creation request body that matches the OpenAPI spec
 */
export interface JobCreateRequest {
  name: string;
  description: string;
  workflow_template: string; // UUID
  app_config?: unknown; // JSON object
  root_resource_content_type?: number | null;
  root_resource_id?: string | null; // UUID
  output_resource_content_type?: number | null;
  output_resource_id?: string | null; // UUID
  log_level?: "debug" | "info" | "warning" | "";
}

/**
 * Builder for creating type-safe job requests
 */
export class JobRequestBuilder {
  private request: JobCreateRequest;

  constructor(name: string, workflowTemplateId: string) {
    this.request = {
      name,
      description: "",
      workflow_template: workflowTemplateId,
    };
  }

  /**
   * Set job description
   */
  setDescription(description: string): this {
    this.request.description = description;
    return this;
  }

  /**
   * Set app configuration (workflow parameters)
   */
  setAppConfig(config: unknown): this {
    this.request.app_config = config;
    return this;
  }

  /**
   * Set root resource (the entity the workflow runs on)
   */
  setRootResource(entityType: EntityType, entityId: string): this {
    const contentTypeId = getContentTypeId(entityType);
    if (contentTypeId !== null) {
      this.request.root_resource_content_type = contentTypeId;
      this.request.root_resource_id = entityId;
    } else {
      console.warn(`Invalid entity type for root resource: ${entityType}`);
    }
    return this;
  }

  /**
   * Set output resource (where the workflow writes results)
   * Typically used for WriteData workflows
   */
  setOutputResource(entityType: EntityType, entityId: string): this {
    const contentTypeId = getContentTypeId(entityType);
    if (contentTypeId !== null) {
      this.request.output_resource_content_type = contentTypeId;
      this.request.output_resource_id = entityId;
    } else {
      console.warn(`Invalid entity type for output resource: ${entityType}`);
    }
    return this;
  }

  /**
   * Set log level
   */
  setLogLevel(level: "debug" | "info" | "warning"): this {
    this.request.log_level = level;
    return this;
  }

  /**
   * Build and return the job request
   */
  build(): JobCreateRequest {
    return { ...this.request };
  }

  /**
   * Validate the request before sending
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.request.name || this.request.name.trim() === "") {
      errors.push("Job name is required");
    }

    if (!this.request.workflow_template) {
      errors.push("Workflow template ID is required");
    }

    // Validate that if output_resource_id is set, output_resource_content_type must also be set
    if (
      this.request.output_resource_id &&
      !this.request.output_resource_content_type
    ) {
      errors.push(
        "output_resource_content_type is required when output_resource_id is set"
      );
    }

    // Validate that if root_resource_id is set, root_resource_content_type must also be set
    if (
      this.request.root_resource_id &&
      !this.request.root_resource_content_type
    ) {
      errors.push(
        "root_resource_content_type is required when root_resource_id is set"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Helper function to create a job request for a WriteData workflow
 */
export function createWriteDataJobRequest(
  jobName: string,
  workflowTemplateId: string,
  entityType: EntityType,
  entityId: string,
  appConfig?: unknown,
  description?: string
): JobCreateRequest {
  const builder = new JobRequestBuilder(jobName, workflowTemplateId)
    .setOutputResource(entityType, entityId)
    .setAppConfig(appConfig || {});

  if (description) {
    builder.setDescription(description);
  }

  const validation = builder.validate();
  if (!validation.valid) {
    console.error("Job request validation failed:", validation.errors);
    throw new Error(`Invalid job request: ${validation.errors.join(", ")}`);
  }

  return builder.build();
}

/**
 * Helper function to create a job request for a Readonly workflow
 */
export function createReadonlyJobRequest(
  jobName: string,
  workflowTemplateId: string,
  entityType: EntityType,
  entityId: string,
  appConfig?: unknown,
  description?: string
): JobCreateRequest {
  const builder = new JobRequestBuilder(jobName, workflowTemplateId)
    .setRootResource(entityType, entityId)
    .setAppConfig(appConfig || {});

  if (description) {
    builder.setDescription(description);
  }

  const validation = builder.validate();
  if (!validation.valid) {
    console.error("Job request validation failed:", validation.errors);
    throw new Error(`Invalid job request: ${validation.errors.join(", ")}`);
  }

  return builder.build();
}
