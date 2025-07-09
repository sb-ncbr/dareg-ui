import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms, JsonFormsInitStateProps } from "@jsonforms/react";
import { JSX, useState } from "react";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";

import PaperRenderer, { paperTester } from "@/components/mui/paper-renderer";

const renderers = [
  ...materialRenderers,
  { tester: paperTester, renderer: PaperRenderer },
];

export const loadJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {}
};

type FormsWrappedProps = {
  schema: Object;
  uischema: Object;
  data: any;
  setData: (data: any) => void;
  setErrors?: (errors: any) => void;
} & Omit<
  JsonFormsInitStateProps,
  "data" | "renderers" | "cells" | "schema" | "uischema" | "onChange"
>;

const FormsWrapped = ({
  schema,
  uischema,
  data,
  setData,
  setErrors,
  ...other
}: FormsWrappedProps): JSX.Element => {
  const [localErrors, setLocalErrors] = useState<any>(undefined);

  return (
    <>
      <JsonForms
        schema={schema as JsonSchema}
        uischema={
          Object.keys(uischema).length > 0
            ? (uischema as UISchemaElement)
            : undefined
        }
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={({ errors, data }) => {
          setData(data);
          if (setErrors) {
            setErrors(errors);
            setLocalErrors(errors);
          }
        }}
        validationMode="ValidateAndShow"
        {...other}
      />
      {/* {localErrors && localErrors.length > 0 && 
          <Stack direction="column" spacing={1} sx={{mt: 3, mb: 3}} color="red">
              <Typography variant="h5">Errors</Typography>
              <ul>
                  {localErrors.map((error: ErrorObject, index: Key) => {
                      // For some reason `error.instancePath` was crashing my build
                      // so I had to stringify and parse it to get the value :(
                      const err = JSON.parse(JSON.stringify(error));
                      return(
                          <li key={index}>{err.instancePath}: {err.message}</li>
                      )}
                  )}
              </ul>
          </Stack>
        } */}
    </>
  );
};

export default FormsWrapped;
