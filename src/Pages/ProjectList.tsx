import { Box, Button, Checkbox, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import TopBar from '../Components/TopBar';
import ListCard from '../Components/ListCard';
import ListLink from '../Components/ListLink';
import DatasetCard from '../Components/DatasetCard';
import request from '../Utils/Request';
import TemplateSelect from '../Components/TemplateSelect';
import { useNavigate } from 'react-router-dom';

//interface projectsProps {width: number}
//const Projects: FC<projectsProps> = (props): JSX.Element => {

const ProjectsList = () => {
  const [cardOpen, setCardOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)

  const [newProjName, setNewProjName] = useState("")
  const [newProjDescr, setNewProjDescr] = useState("")
  const [selectedDefaultTemplate, setSelectedDefaultTemplate] = useState<{id: string, name: string, descr: string}>({id: "", name: "", descr: ""})

  const [currentNode, setCurrentNode] = useState
    <{ id: string, name: string, descr: string, defaultTemplateID: string } | any>
    ({ id: "", name: "", descr: "", defaultTemplateID: "" })

  const openSchemeCard = (id: string) => {
    request("/view_node", {
      id: id
    }, (response) => {
      setCurrentNode(response)
      setCardOpen(true)
    })
  }

  const [projList, setProjList] = useState<any>([])
  const didRun = useRef(false)
  useEffect(() => {
    if (didRun.current === false)
      request("/get_nodes", {
        upper: null
      }, (response) => {
        setProjList(response)
      })
    didRun.current = true
  }, [])

  const [datasetCardOpen, setDatasetCardOpen] = useState(false)
  const [currentDataset, setCurrentDataset] = useState({name: "", descr: "", scheme: "{}", ui_scheme: "{}", data: "{}"})

  const navigate = useNavigate()

  return (
    <Box display="flex" maxHeight="100vh">
      <Box paddingTop={8} paddingRight="30px" flexGrow="1" sx={{ filter: cardOpen || newOpen ? "" : "", overflowY: "scroll" }}>
        {projList.map((item: { id: string; name: string; description: string; }) => (
          <ListLink
            name={item.name}
            username={"username"}
            date={"item.date"}
            disabled={cardOpen || newOpen}
            onClick={() => navigate(`/projects/${item.id}`)}
          />
        ))}
      </Box>
      <Box position="fixed" width={870} maxHeight="100vh" sx={{ overflowY: "auto", scrollbarGutter: "stable" }}>
        <Box display={cardOpen || datasetCardOpen ? "none" : "block"}>
          <TopBar newOpen={() => setNewOpen(true)} projectView={true} />
        </Box>
      </Box>
      <Dialog fullWidth open={newOpen} onClose={() => setNewOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Vytvořit nový projekt</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Název"
            fullWidth
            variant="filled"
            value={newProjName}
            onChange={(e) => setNewProjName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="filled"
            multiline
            rows="3"
            sx={{ mb: 2 }}
            value={newProjDescr}
            onChange={(e) => setNewProjDescr(e.target.value)}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>Vybrat výchozí šablonu</Typography>
          <TemplateSelect selectedTemplate={selectedDefaultTemplate} setSelectedTemplate={setSelectedDefaultTemplate}/>
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setNewOpen(false)}>Zrušit</Button>
            <Button
              sx={{ ml: 2 }}
              variant='contained'
              onClick={() => {
                request("/new_node", {
                  name: newProjName,
                  descr: newProjDescr,
                  upper: null,
                  default_template: selectedDefaultTemplate.id
                }, () => {
                  setNewOpen(false)
                })
              }}
            >
              Pokračovat
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProjectsList;

