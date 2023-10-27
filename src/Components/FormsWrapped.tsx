import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import { JsonForms, JsonFormsInitStateProps } from '@jsonforms/react';
import { useMemo, useState } from 'react';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

const loadJSON = (json: string) => {
  try {
    return (JSON.parse(json))
  }
  catch {
  }
}

type FormsWrappedProps = {
  schema: string,
  uischema: string,
  data: any,
  setData: (data: any) => void,
} & Omit<JsonFormsInitStateProps, "data" | "renderers" | "cells" | "schema" | "uischema" | "onChange">

const FormsWrapped = ({schema, uischema, data, setData, ...other}: FormsWrappedProps): JSX.Element => {

  const JSschema = useMemo(() => loadJSON(schema), [schema])
  const JSschemaui = useMemo(() => loadJSON(uischema), [schema])

  return (
    <>
      <JsonForms
        schema={JSschema as JsonSchema}
        uischema={uischema===""|| uischema==="{}" ? undefined : JSschemaui as UISchemaElement}
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={({ errors, data }) => setData(data)}
        validationMode='ValidateAndShow'
        {...other}
        />
    </>
  )
};

export default FormsWrapped;

