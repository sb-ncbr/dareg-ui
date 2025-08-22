import {
  FormHelperText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { ArrayTranslations } from "@jsonforms/core";
import ValidationIcon from "./validation-icon";

export interface ArrayLayoutToolbarProps {
  label: string;
  description: string;
  errors: string;
  path: string;
  enabled: boolean;
  addItem(path: string, data: unknown): () => void;
  removeMatrix(path: string): () => void;
  createDefault(): unknown;
  translations: ArrayTranslations;
}

export const ArrayLayoutToolbar = React.memo(function ArrayLayoutToolbar({
  label,
  description,
  errors,
  addItem,
  removeMatrix,
  path,
  enabled,
  createDefault,
  translations,
}: ArrayLayoutToolbarProps) {
  const handleAddItem = () => {
    addItem(path, createDefault())();
  };

  const handleRemoveMatrix = () => {
    removeMatrix(path)();
  };

  return (
    <Toolbar disableGutters={true}>
      <Stack width="100%">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h6">{label}</Typography>
            {errors.length !== 0 && (
              <ValidationIcon id="tooltip-validation" errorMessages={errors} />
            )}
          </Stack>
          {enabled && (
            <Stack direction="row" spacing={1}>
              <Tooltip
                id="tooltip-add"
                title={translations.addTooltip}
                placement="bottom"
              >
                <IconButton
                  aria-label={translations.addTooltip}
                  onClick={handleAddItem}
                  size="large"
                >
                  <Plus />
                </IconButton>
              </Tooltip>
              <Tooltip
                id="tooltip-remove"
                title={translations.removeTooltip}
                placement="bottom"
              >
                <IconButton
                  onClick={handleRemoveMatrix}
                  style={{ float: "right" }}
                  aria-label={translations.removeAriaLabel}
                  size="large"
                >
                  <Trash2 />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
        {description && <FormHelperText>{description}</FormHelperText>}
      </Stack>
    </Toolbar>
  );
});
