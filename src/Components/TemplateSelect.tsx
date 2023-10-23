import { Autocomplete, Box, Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import request from "../Utils/Request";
import { useNavigate } from "react-router-dom";
import { useFetch } from "use-http";

const TemplateSelect = (props: {
  selectedTemplate: {id: string, name: string, descr: string},
  setSelectedTemplate: (temp: {id: string, name: string, descr: string}) => void
}) => {

  const [ data, setData ] = useState<any>();
  const {get, post, patch, response, loading, error } = useFetch(`/templates`);
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const fetched = await get()
      setData(fetched)
    })()
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
        options={data}
        sx={{ml: 0, width: "33%"}}
        getOptionLabel={(option: any) => option.name}
        value={props.selectedTemplate}
        onChange={(e, value) => props.setSelectedTemplate(value)}
        renderInput={(params) => <TextField variant="filled" {...params} label="Scheme" />}
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