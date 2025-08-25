import { MetadataField, MetadataSection, UnwrappedMetadata } from "../types/search-models";

/**
 * Metadata unwrapper that creates sections for top-level objects
 * and processes primitive fields within each section
 */
export function unwrapMetadata(schema: any, prefix: string = ""): UnwrappedMetadata {
  const sections: MetadataSection[] = [];
  const flatFields: MetadataField[] = [];
  const matrixFields: MetadataField[] = [];
  const suggestionFields: MetadataField[] = [];
  
  if (!schema || !schema.properties) {
    console.log("unwrapMetadata: No schema or properties found", { schema, prefix });
    return { sections, flatFields, matrixFields, suggestionFields };
  }

  console.log("unwrapMetadata: Starting with schema", { 
    hasProperties: !!schema.properties, 
    propertyKeys: Object.keys(schema.properties),
    prefix 
  });

  // Process each top-level property
  Object.keys(schema.properties).forEach((key) => {
    const property = schema.properties[key];
    console.log("Processing top-level property:", { key, type: property.type });
    
    // If it's an object with properties, create a section
    if (property.type === "object" && property.properties) {
      const sectionFields: MetadataField[] = [];
      
      // Process nested properties
      Object.keys(property.properties).forEach((nestedKey) => {
        const nestedProperty = property.properties[nestedKey];
        const fieldKey = `${key}.${nestedKey}`;
        
        console.log("Processing nested property:", { nestedKey, type: nestedProperty.type, fieldKey });
        
        // Only include simple field types in manual fields
        if (isSimpleFieldType(nestedProperty)) {
          const field: MetadataField = {
            key: fieldKey,
            label: nestedProperty.title || nestedKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            inputType: mapSchemaPropertyToInputType(nestedProperty),
            description: nestedProperty.description,
            required: nestedProperty.required,
            min: nestedProperty.minimum,
            max: nestedProperty.maximum,
            step: nestedProperty.multipleOf,
            placeholder: nestedProperty.description || `Enter ${nestedKey.replace(/_/g, " ")}`
          };
          
          sectionFields.push(field);
        }
      });
      
      // Create the section
      if (sectionFields.length > 0) {
        const section: MetadataSection = {
          key,
          label: property.title || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          description: property.description,
          fields: sectionFields,
          isCollapsible: true,
          defaultExpanded: false
        };
        
        sections.push(section);
        console.log("Created section:", { key, fieldCount: sectionFields.length });
      }
    } else {
      // Only include simple field types in manual fields
      if (isSimpleFieldType(property)) {
        const field: MetadataField = {
          key,
          label: property.title || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          inputType: mapSchemaPropertyToInputType(property),
          description: property.description,
          required: property.required,
          min: property.minimum,
          max: property.maximum,
          step: property.multipleOf,
          placeholder: property.description || `Enter ${key.replace(/_/g, " ")}`
        };
        
        flatFields.push(field);
        console.log("Added flat field:", { key, type: field.inputType });
      }
    }
  });
  
  console.log("unwrapMetadata: Final result", { 
    sectionsCount: sections.length,
    flatFieldsCount: flatFields.length,
    matrixFieldsCount: matrixFields.length,
    suggestionFieldsCount: suggestionFields.length
  });
  
  return { sections, flatFields, matrixFields, suggestionFields };
}

/**
 * Determines if a field type is simple enough for manual input
 * Complex types (arrays, objects, enums) should be handled by enhanced forms
 */
function isSimpleFieldType(property: any): boolean {
  // Skip arrays (including matrices)
  if (property?.type === "array") {
    return false;
  }
  
  // Skip objects with properties (nested structures)
  if (property?.type === "object" && property?.properties) {
    return false;
  }
  
  // Skip enums (these should be handled by enhanced forms)
  if (property?.enum && Array.isArray(property.enum)) {
    return false;
  }
  
  // Skip anyOf, oneOf, allOf (complex schemas)
  if (property?.anyOf || property?.oneOf || property?.allOf) {
    return false;
  }
  
  // Only allow simple primitive types
  return ["string", "number", "integer", "boolean"].includes(property?.type);
}

/**
 * Simple mapping of schema property types to input types
 */
function mapSchemaPropertyToInputType(property: any): "string" | "number" | "boolean" | "date" | "matrix" {
  if (property?.type === "string" && 
      (property?.format === "date" || property?.format === "date-time")) {
    return "date";
  }
  
  switch (property?.type) {
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "string":
    default:
      return "string";
  }
}

/**
 * Creates a flat list of all fields for backward compatibility
 */
export function createFlatFilterOptions(metadata: UnwrappedMetadata): any[] {
  const allFields = [
    ...metadata.flatFields,
    ...metadata.matrixFields,
    ...metadata.suggestionFields,
    ...metadata.sections.flatMap(section => section.fields)
  ];
  
  return allFields.map(field => ({
    key: field.key,
    label: field.label,
    inputType: field.inputType,
    description: field.description,
    required: field.required,
    min: field.min,
    max: field.max,
    step: field.step
  }));
}
