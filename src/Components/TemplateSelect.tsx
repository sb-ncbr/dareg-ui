import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetch } from "use-http";
import { TemplatesData } from "../types/global";

type Props = {
  selectedTemplate: TemplatesData,
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplatesData>>
}

const TemplateSelect = ({selectedTemplate, setSelectedTemplate}: Props) => {

  const [ data, setData ] = useState<TemplatesData[]>();
  const { get } = useFetch(`/templates`);

  useEffect(() => {
    (async () => {
      setData(await get())
    })()
  }, [get])

  return (
    <>
      {/* <Box display="none">
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
      </Box> */}
      <Autocomplete
        disableClearable
        id="combo-box-demo"
        options={data || []}
        sx={{ml: 0, width: "33%"}}
        getOptionLabel={(option: TemplatesData) => option.name}
        value={selectedTemplate}
        onChange={(e, value) => setSelectedTemplate(value)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField variant="filled" {...params} label="Scheme" />}
      />
    </>
  )
};

export default TemplateSelect;