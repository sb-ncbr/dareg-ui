export type AutoFilterState = Record<
  string,
  string | number | boolean | Date | { from?: Date; to?: Date } | { $in: any[] } | { $gte: any; $lte: any } | any[][]
>;

/**
 * Converts form data from FormsWrapped component to AutoFilterState format
 * This ensures compatibility with the existing search system
 */
export function convertFormDataToFilters(formData: any): AutoFilterState {
  const filters: AutoFilterState = {};
  
  // Recursively process the form data and flatten nested structures
  function processFormData(data: any, prefix: string = ''): void {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const fieldKey = prefix ? `${prefix}.${key}` : key;
        
        // Handle different value types
        if (Array.isArray(value)) {
          // Handle array values
          if (value.length > 0) {
            // Check if this is a nested array (matrix) or a simple array
            if (Array.isArray(value[0])) {
              // This is a matrix/2D array, treat as a single value
              filters[fieldKey] = value;
            } else {
              // This is a simple array, treat as multiple selections
              filters[fieldKey] = { $in: value };
            }
          }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle complex objects
          if ('from' in value && 'to' in value) {
            // Handle date ranges
            filters[fieldKey] = { 
              $gte: (value as any).from, 
              $lte: (value as any).to 
            };
          } else if ('min' in value || 'max' in value) {
            // Handle numeric ranges
            const rangeFilter: any = {};
            if ('min' in value) rangeFilter.$gte = (value as any).min;
            if ('max' in value) rangeFilter.$lte = (value as any).max;
            filters[fieldKey] = rangeFilter;
          } else if (Object.keys(value).length > 0) {
            // Recursively process nested objects to flatten them
            processFormData(value, fieldKey);
          }
        } else {
          // Handle simple values (string, number, boolean)
          filters[fieldKey] = value;
        }
      }
    });
  }
  
  processFormData(formData);
  return filters;
}

/**
 * Merges forms-wrapped data with existing filter state
 * This allows users to use both enhanced forms and manual filters together
 */
export function mergeFormDataWithFilters(
  formsData: any, 
  existingFilters: AutoFilterState
): AutoFilterState {
  const convertedFormsData = convertFormDataToFilters(formsData);
  
  return {
    ...existingFilters,
    ...convertedFormsData
  };
}

/**
 * Validates that the form data can be converted to valid search filters
 */
export function validateFormDataForSearch(formData: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for required fields if needed
  // Add validation logic here based on your requirements
  
  // Check for invalid value types
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Validate object values
        if ('from' in value && 'to' in value) {
          // Date range validation
          if ((value as any).from > (value as any).to) {
            errors.push(`${key}: Start date must be before end date`);
          }
        }
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
