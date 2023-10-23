import { Box, Button, ButtonGroup, Dialog, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, styled } from "@mui/material";
import {
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { SaveRounded, TextDecreaseRounded, TextIncreaseRounded, UndoRounded, VisibilityRounded } from "@mui/icons-material";
import FormsWrapped from "./FormsWrapped";
import request from "../Utils/Request";
import { TemplatesData } from "../Pages/Templates/TemplateList";

const FullscreenTextArea = styled("textarea")(({ theme }) => ({
  height: "100%",
  resize: "none",
  flex: "1",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: "monospace"
}));

export type TemplateEditorState = {
  name: string,
  description: string,
  scheme: string,
  uischeme: string,
  id?: string
}

type TemplateEditorProps = {
  data: TemplatesData,
  setData: Dispatch<SetStateAction<TemplatesData>>,
  open: boolean,
  closeSelf: () => void,
  id?: string
}

const TemplateEditor = ({data, setData, open, closeSelf, id}: TemplateEditorProps): JSX.Element => {

  const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
  ];

  const [schemeTextArea, setSchemeTextArea] = useState("")
  const [schemeRenderJSON, setSchemeRenderJSON] = useState("")
  const [uiTextArea, setUiTextArea] = useState("")
  const [uiRenderJSON, setUiRenderJSON] = useState("")

  const [textSize, setTextSize] = useState(11)
  const [editorMode, setEditorMode] = useState("scheme")

  useEffect(() => {
    setSchemeTextArea(data.scheme)
    setSchemeRenderJSON(data.uischeme)
  }, [])

  const saveForm = () => {
    setData({
      name: data.name,
      description: data.description,
      id: id,
      scheme: schemeTextArea,
      uischeme: uiTextArea,
    })
    closeSelf()
  }

  return (
    <Dialog fullScreen open={open} onClose={closeSelf}>
      <Box display="flex" flexDirection="column" height="100vh" padding={3}>
        <Stack direction={"row"} spacing={3} sx={{mb: 1}}>
          <Typography variant="h5">Editing template: {data.name}</Typography>
          <Typography variant="h6">({data.description})</Typography>
        </Stack>
        <Box height="100%" display="flex" gap={2} justifyContent="space-between" >
          <Box height="100%" width="50%" display="flex">
            <Box width="100%" display={editorMode === "ui" ? "none" : "flex"}>
              <FullscreenTextArea
                value={schemeTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => setSchemeTextArea(e.target.value)} /> {/* Add tab indent support */}
            </Box>
            <Box width="100%" display={editorMode === "scheme" ? "none" : "flex"}>
              <FullscreenTextArea
                value={uiTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => setUiTextArea(e.target.value)} />
            </Box>
          </Box>
          <Box flex="1">
            <FormsWrapped data={data} setData={setData} schema={schemeRenderJSON} uischema={uiRenderJSON}/>
          </Box>
        </Box>
        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Stack direction={"row"} gap={2}>
            <ToggleButtonGroup
              color="primary"
              value={editorMode}
              exclusive
              size="small"
              onChange={(e, value) => {
                if (value !== null)
                  setEditorMode(value)
              }}
            >
              <ToggleButton value="scheme">Scheme</ToggleButton>
              <ToggleButton value="ui">UI scheme</ToggleButton>
              <ToggleButton value="both">Side-by-side</ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => setTextSize(textSize - 1)}><TextDecreaseRounded fontSize="small" /></Button>
              <TextField
                size="small"
                variant="outlined"
                sx={{ width: 50 }}
                value={textSize}
                onChange={(e) => /^\d+$/.test(e.target.value) && setTextSize(Number(e.target.value))}
              />
              <Button onClick={() => setTextSize(textSize + 1)}><TextIncreaseRounded fontSize="small" /></Button>
            </ButtonGroup>
            <Button
              startIcon={<VisibilityRounded />}
              onClick={() => {
                setSchemeRenderJSON(schemeTextArea)
                setUiRenderJSON(uiTextArea)
              }}
            >
              Render preview
            </Button>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Button startIcon={<UndoRounded />} onClick={closeSelf}>Zahodit změny</Button>
            <Button startIcon={<SaveRounded />} variant="contained" onClick={saveForm}>Uložit</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
};

export default TemplateEditor;