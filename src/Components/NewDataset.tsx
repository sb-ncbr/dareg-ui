import { Box, Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import TemplateSelect from "./TemplateSelect";
import FormsWrapped from "./FormsWrapped";
import { useEffect, useState } from "react";
import request from "../Utils/Request";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const NewDataset = () => {
  const params = useParams()

  const [selectedTemplateForm, setSelectedTemplateForm] = useState<{id: string, name: string, descr: string, scheme: string, ui_scheme: string}>({id: "", name: "", descr: "", scheme: "", ui_scheme: ""})
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, name: string, descr: string}>({id: "", name: "", descr: ""})

  const [name, setName] = useState("")
  const [descr, setDescr] = useState("")
  
  useEffect(() => {
    request("/view_template", {
      id: selectedTemplate.id==="" ? params.projId : selectedTemplate.id
    }, (response) => {
      setSelectedTemplateForm(response)
    })
  }, [selectedTemplate])

  const [data, setData] = useState<any>({});
  const navigate = useNavigate()

  return (
    <Dialog fullScreen open={true}>
      <Stack direction="column" height="100vh" justifyContent="space-between" p={3}>
        <Typography variant="h5" sx={{ mb: 1 }}>Přidat dataset</Typography>
        <Stack flex={1} direction="row">
          <Stack flex={1} direction="column" mr={3}>
            <TextField
              margin="dense"
              id="name"
              label="Název"
              fullWidth
              variant="filled"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Popis"
              fullWidth
              variant="filled"
              multiline
              rows="3"
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Při nevyplnění bude použita výchozí šablona pro projekt</Typography>
            <TemplateSelect selectedTemplate={selectedTemplate} setSelectedTemplate={(template) => setSelectedTemplate(template)}/>
          </Stack>
          <Box flex={2}>
            <FormsWrapped data={data} setData={setData} schema={selectedTemplateForm.scheme} uischema={selectedTemplateForm.ui_scheme}/>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button onClick={() => navigate(`/projects/${params.projId}`)}>Zrušit</Button>
          <Button
            sx={{ ml: 2 }}
            variant='contained'
            onClick={() => {
              request("/new_node", {
                name: name,
                descr: descr,
                upper: params.projId,
                default_template: null
              }, (response) => {
                request("/save_form_data", {
                  id: response.id,
                  used_template: selectedTemplateForm.id,
                  data: data
                }, () => {
                  navigate(`/projects/${params.projId}/${response.id}`)
                })
              })
            }}
          >
            Přidat
          </Button>
          
        </Stack>
      </Stack>
    </Dialog>
  )
};

export default NewDataset;