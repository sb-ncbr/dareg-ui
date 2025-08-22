import { withJsonFormsArrayLayoutProps, useJsonForms } from "@jsonforms/react";
import { ArrayLayoutProps } from "@jsonforms/core";
import { MaterialNumberCell } from "@jsonforms/material-renderers";
import { ArrayLayoutToolbar } from "../../components/array-tool-bar";

/**
 * Modified version of the default material renderer:
 * https://github.com/eclipsesource/jsonforms/blob/master/packages/material-renderers/src/layouts/MaterialArrayLayout.tsx
 */

const range = (start: number, end: number = 0): number[] => {
  return Array.from({ length: end - start }, (_, i) => start + i);
};

const MatrixRenderer = (props: ArrayLayoutProps) => {
  const {
    enabled,
    data,
    path,
    schema,
    uischema,
    errors,
    addItem,
    removeItems,
    renderers,
    cells,
    label,
    required,
    rootSchema,
    config,
    uischemas,
    description,
  } = props;

  const ctx = useJsonForms();

  // Get matrix dimensions from schema or default to reasonable values
  const rowCount = schema.minLength || 3;
  const colCount = schema.minItems || 3;

  const innerCreateDefaultValue = () => {
    return new Array(colCount).fill(0);
  };

  const addWithCheck = (path: string, value: unknown) => {
    // Always allow adding new rows
    return addItem(path, value);
  };

  const removeMatrix = (path: string) => {
    if (data && removeItems) {
      // Remove all rows from the matrix
      const currentData = path
        .split(".")
        .reduce(
          (obj, attr) => (obj && obj[attr] ? obj[attr] : []),
          ctx.core?.data
        );

      if (Array.isArray(currentData) && currentData.length > 0) {
        return removeItems(path, range(0, currentData.length));
      }
    }
    return () => {};
  };

  // Get actual data from the context
  const matrixData = path
    .split(".")
    .reduce((obj, attr) => (obj && obj[attr] ? obj[attr] : []), ctx.core?.data);

  // Ensure matrix has at least the minimum dimensions
  const currentRows = Array.isArray(matrixData) ? matrixData.length : 0;
  const currentCols =
    currentRows > 0 && Array.isArray(matrixData[0]) ? matrixData[0].length : 0;

  // Calculate how many rows and columns we need
  const targetRows = Math.max(rowCount, currentRows);
  const targetCols = Math.max(colCount, currentCols);

  return (
    <div style={{ marginBottom: "25px" }}>
      <ArrayLayoutToolbar
        translations={{
          addTooltip: "Add row",
          removeTooltip: "Remove all rows",
          removeAriaLabel: "Remove all rows",
        }}
        label={label}
        description={description || ""}
        errors={errors}
        path={path}
        enabled={enabled}
        addItem={addWithCheck}
        removeMatrix={removeMatrix}
        createDefault={innerCreateDefaultValue}
      />

      {/* Always show the matrix table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <tbody>
          {Array.from({ length: targetRows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: targetCols }, (_, cellIndex) => {
                const cellPath = `${path}.${rowIndex}.${cellIndex}`;
                const cellValue = matrixData?.[rowIndex]?.[cellIndex] ?? 0;

                return (
                  <td
                    key={cellIndex}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                      minWidth: "60px",
                    }}
                  >
                    <MaterialNumberCell
                      key={cellPath}
                      path={cellPath}
                      schema={schema}
                      uischema={uischema}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show current matrix info */}
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        Matrix size: {targetRows} × {targetCols}
        {currentRows > 0 && ` (${currentRows} rows with data)`}
      </div>
    </div>
  );
};

export default withJsonFormsArrayLayoutProps(MatrixRenderer);
