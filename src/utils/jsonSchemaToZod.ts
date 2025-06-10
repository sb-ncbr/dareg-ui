import { z, ZodTypeAny } from "zod";

function jsonSchemaToZod(properties: any): ZodTypeAny {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [key, prop] of Object.entries(properties)) {
    let zodType: ZodTypeAny;
    switch (prop.type) {
      case "string":
        zodType = z.string();
        break;
      case "integer":
        zodType = z.number().int();
        break;
      default:
        zodType = z.any();
    }
    // Add required validation if needed (here, all fields are required)
    zodType = zodType.min(1, `${prop.title || key} is required`);
    shape[key] = zodType;
  }
  return z.object(shape);
}