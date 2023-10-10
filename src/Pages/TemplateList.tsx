import { Box, Button, Checkbox, Dialog, DialogContent, Stack, TextField, TextareaAutosize, Typography, styled } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import TopBar from '../Components/TopBar';
import ListCard from '../Components/ListCard';
import ListLink from '../Components/ListLink';
import TemplateEditor from '../Components/TemplateEditor';
import SchemeCard from '../Components/SchemeCard';
import request from '../Utils/Request';
import { useNavigate } from 'react-router-dom';

//interface projectsProps {width: number}
//const Projects: FC<projectsProps> = (props): JSX.Element => {

const TemplateList = () => {
  const [cardOpen, setCardOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorID, setEditorID] = useState("")
  const [newSchemeOpen, setNewSchemeOpen] = useState(false)

  const [newSchemeName, setNewSchemeName] = useState("")
  const [newSchemeDescr, setNewSchemeDescr] = useState("")

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

  const [currentScheme, setCurrentScheme] = useState
    <{ id: string, name: string, descr: string, scheme: string, ui_scheme: string } | any>
    ({ id: "", name: "", descr: "", scheme: "{}", ui_scheme: "{}" })

  const closeSchemeCard = () => {
    setCardOpen(false)
  }

  const navigate = useNavigate()

  return (
    <Box display="flex" maxHeight="100vh">
      <Box paddingTop={8} paddingRight="30px" flexGrow="1" sx={{ opacity: cardOpen || editorOpen ? 0 : 1, overflowY: "scroll" }}>
        {schemeList.map((item: { id: string; name: string; description: string; }) => (
          <ListLink
            name={item.name}
            username={"username"}
            date={"item.date"}
            disabled={cardOpen || editorOpen}
            onClick={() => navigate(`/templates/${item.id}`)}
          />
        ))}
      </Box>
      <Box position="fixed" width={870} maxHeight="100vh" sx={{ overflowY: "auto", scrollbarGutter: "stable" }}>
        <Box display={cardOpen ? "none" : "block"}>
            <TopBar newOpen={() => setNewSchemeOpen(true)} projectView={false} />
        </Box>
      </Box>
      <TemplateEditor open={editorOpen} closeSelf={() => setEditorOpen(false)} id={editorID} />
      <Dialog fullWidth open={newSchemeOpen} onClose={() => setNewSchemeOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Vytvořit nové schéma</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Název"
            fullWidth
            variant="outlined"
            value={newSchemeName}
            onChange={(e) => setNewSchemeName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="outlined"
            multiline
            rows="3"
            sx={{ mb: 2 }}
            value={newSchemeDescr}
            onChange={(e) => setNewSchemeDescr(e.target.value)}
          />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setNewSchemeOpen(false)}>Zrušit</Button>
            <Button
              sx={{ ml: 2 }}
              variant='contained'
              onClick={() => {
                request("/new_template", {
                  name: newSchemeName,
                  descr: newSchemeDescr
                }, (response) => {
                  setNewSchemeOpen(false)
                  setEditorOpen(true)
                  setEditorID(response.id)
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

export default TemplateList;

