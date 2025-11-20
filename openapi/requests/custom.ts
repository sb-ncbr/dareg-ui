import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { WorkflowTemplate, Job } from './types.gen';

export class ApiServiceCustom {
    /**
     * Retrieve workflows that can be run on a specific entity.
     * GET /api/v1/workflow/{entity_type}/{entity_id}/
     */
    public static getApiV1WorkflowByEntity(data: { entity_type: 'project' | 'dataset' | 'experiment'; entity_id: string; }): CancelablePromise<WorkflowTemplate[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/workflow/{entity_type}/{entity_id}/',
            path: {
                entity_type: data.entity_type,
                entity_id: data.entity_id,
            },
        });
    }

    /**
     * Retrieve all jobs that ran on a specific entity (Project, Dataset, or Experiment).
     * GET /api/v1/jobs/entity/{entity_id}/
     */
    public static getApiV1JobsByEntity(data: { entity_id: string; }): CancelablePromise<Job[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/jobs/entity/{entity_id}/',
            path: {
                entity_id: data.entity_id,
            },
        });
    }
}


