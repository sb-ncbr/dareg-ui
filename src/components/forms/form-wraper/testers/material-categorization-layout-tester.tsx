import {
  JsonSchema,
  RankedTester,
  UISchemaElement,
  TesterContext,
  isCategorization,
  hasCategory,
} from "@jsonforms/core";

const MaterialCategorizationLayoutTester: RankedTester = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext
) => {
  if (isCategorization(uischema) && hasCategory(uischema)) {
    return 10;
  }
  return -10;
};

export default MaterialCategorizationLayoutTester;
