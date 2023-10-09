import { Autocomplete, Box, Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import request from "../Utils/Request";

const TemplateSelect = (props: {
  selectedTemplate: {id: string, name: string, descr: string},
  setSelectedTemplate: (temp: {id: string, name: string, descr: string}) => void
}) => {

  const [schemeList, setSchemeList] = useState<any>([])
  
  const didRun = useRef(false)
  useEffect(() => {
    if (didRun.current === false)
      request("/get_templates", {

      }, (response) => {
        setSchemeList(response)
      })
    didRun.current = true
  }, [])


  return (
    <>
      <Box display="none">
        <Autocomplete
          sx={{ mt: 1, mb: 2 }}
          multiple
          disableClearable
          fullWidth
          options={tags}
          getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField variant="filled" {...params} label="Filtrovat výběr podle značek" />
              )}
          />
      </Box>
      <Autocomplete
        disableClearable
        id="combo-box-demo"
        options={schemeList}
        getOptionLabel={(option: any) => option.name}
        value={props.selectedTemplate}
        onChange={(e, value) => props.setSelectedTemplate(value)}
        renderInput={(params) => <TextField variant="filled" {...params} label="Šablona" />}
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