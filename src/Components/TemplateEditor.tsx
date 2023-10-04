import { Box, Button, ButtonGroup, Dialog, IconButton, Input, Stack, TextField, TextareaAutosize, ToggleButton, ToggleButtonGroup, Typography, styled } from "@mui/material";
import schema from '../schema.json';
import uischema from '../uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { Add, AddRounded, RemoveRounded, SaveRounded, TextDecreaseRounded, TextIncreaseRounded, UndoRounded, Visibility, VisibilityRounded } from "@mui/icons-material";
import { UISchemaElement } from "@jsonforms/core";
import request from "../Utils/Request";

const FullscreenTextArea = styled("textarea")(({ theme }) => ({
  height: "100%",
  resize: "none",
  flex: "1",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: "monospace"
}));

const TemplateEditor = (props: {
  open: boolean,
  closeSelf: () => void,
  id: string
}) => {

  const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
  ];

  const [data, setData] = useState<any>({});

  const [schemeTextArea, setSchemeTextArea] = useState("")
  const [schemeRenderJSON, setSchemeRenderJSON] = useState({})
  const [uiTextArea, setUiTextArea] = useState("")
  const [uiRenderJSON, setUiRenderJSON] = useState<UISchemaElement>()

  const [textSize, setTextSize] = useState(11)
  const [editorMode, setEditorMode] = useState("scheme")

  useEffect(() => {
    if (props.id !== "")
      request("/get_scheme_form", {
        id: props.id
      }, (response) => {
        console.log(response)
        setSchemeTextArea(response.scheme)
        setUiTextArea(response.ui_scheme)
      })
  }, [props.id])

  const saveForm = () => {
    request("/save_scheme_form", {
      id: props.id,
      scheme: schemeTextArea,
      ui_scheme: uiTextArea
    }, () => {
      props.closeSelf()
    })
  }

  return (
    <Dialog fullScreen open={props.open} onClose={props.closeSelf}>
      <Box display="flex" flexDirection="column" height="100vh" padding={3}>
        <Typography variant="h5" sx={{ mb: 1 }}>plants_schema_2023</Typography>
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
            <JsonForms
              schema={schemeRenderJSON}
              uischema={uiRenderJSON}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
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
                setSchemeRenderJSON(JSON.parse(schemeTextArea))
                setUiRenderJSON(JSON.parse(uiTextArea))
              }}
            >
              Render preview
            </Button>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Button startIcon={<UndoRounded />} onClick={props.closeSelf}>Zahodit změny</Button>
            <Button startIcon={<SaveRounded />} variant="contained" onClick={saveForm}>Uložit</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
};

export default TemplateEditor;