export type WorkflowTypeEnum = 'WriteData' | 'Readonly' | 'In-placeChange' | 'Export';

export interface WorkflowConfigField {
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workflowType: WorkflowTypeEnum;
  appConfigDetails: Record<string, WorkflowConfigField>;
  created: string;
  modified: string;
}

export interface WorkflowFormData {
  [key: string]: string | number | boolean | WorkflowFormData;
}

export interface WorkflowJobData {
  workflow: Workflow;
  formData: WorkflowFormData;
  jobName?: string;
  jobDescription?: string;
}
