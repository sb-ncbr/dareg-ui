import { Autocomplete, Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

const TemplateSelect = () => {
  
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Vybrat šablonu</Typography>
      <Autocomplete
        sx={{ mt: 1, mb: 2 }}
        multiple
        disableClearable
        fullWidth
        options={tags}
        getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField {...params} label="Filtrovat výběr podle značek" />
            )}
        />
      <Autocomplete
        disableClearable
        id="combo-box-demo"
        options={templates}
        renderInput={(params) => <TextField {...params} label="Šablona" />}
      />
    </>
  )
};

export default TemplateSelect;

const tags = [
  { title: 'plants' },
  { title: 'bio_warfare' },
  { title: 'cf_measure' },
];

const templates = [
  { label: 'super_template' },
  { label: 'template_2023' },
  { label: 'cf_master' },
];