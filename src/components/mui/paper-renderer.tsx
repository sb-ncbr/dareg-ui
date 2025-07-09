import React from "react";
import Paper from "@mui/material/Paper";
import { rankWith, uiTypeIs, RendererProps } from "@jsonforms/core";
import { withJsonFormsLayoutProps, JsonFormsDispatch } from "@jsonforms/react";

const PaperRenderer = ({
  visible,
  enabled,
  uischema,
  path,
  renderers,
  cells,
  schema,
  ...props
}: RendererProps) => {
  if (!visible) {
    return null;
  }

  // @ts-ignore
  const elements = uischema.elements || [];

  return (
    <Paper elevation={0} style={{ padding: 16, marginBottom: 16, rowGap: 5 }}>
      {elements.map((element: any, index: number) => (
        <JsonFormsDispatch
          key={index}
          uischema={element}
          schema={schema}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      ))}
    </Paper>
  );
};

export default withJsonFormsLayoutProps(PaperRenderer);

export const paperTester = rankWith(4, uiTypeIs("Paper"));
