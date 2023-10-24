import { Box, Button, ButtonGroup, CircularProgress, Dialog, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, styled } from "@mui/material";
import {
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SaveRounded, TextDecreaseRounded, TextIncreaseRounded, UndoRounded, VisibilityRounded } from "@mui/icons-material";
import FormsWrapped from "./FormsWrapped";
import { TemplatesData } from "../types/global";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { validate } from "@jsonforms/core";
import ContentHeader from "./ContentHeader";
import validateSchema from "../Utils/validateSchema";

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

type EditorMode = "scheme" | "ui" | "both"

const TemplateEditor = ({data, setData, open, closeSelf, id}: TemplateEditorProps): JSX.Element => {

  const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
  ];

  const [schemeTextArea, setSchemeTextArea] = useState<string>(data.scheme)
  const [uiTextArea, setUiTextArea] = useState<string>(data.uischeme)

  const [textSize, setTextSize] = useState<number>(14)
  const [editorMode, setEditorMode] = useState<EditorMode>(uiTextArea === "{}" ? "scheme" : "both")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setSchemeTextArea(data.scheme)
    setUiTextArea(data.uischeme)
  }, [data.scheme, data.uischeme])

  const saveForm = () => {
    setData({
      ...data,
      scheme: schemeTextArea,
      uischeme: uiTextArea,
    })
    closeSelf()
  }

  const refreshPreview = () => {
    console.log(validateSchema(JSON.parse(schemeTextArea), {}));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }

  return (
    <Dialog fullScreen open={open} onClose={closeSelf}>
      <Box display="flex" flexDirection="column" padding={1}>
        <ContentHeader title={`Editing template: ${data.name}`} actions={
          <Stack direction={"row"} gap={1}>
              <Button startIcon={<UndoRounded />} color="error" onClick={closeSelf}>Discard</Button>
              <Button startIcon={<SaveRounded />} variant="contained" onClick={saveForm}>Save</Button>
          </Stack>
        } 
        sx={{
          position: "sticky",
          top: "3px",
          zIndex: 1000,
        }}
        backAction={closeSelf}>
          <Stack direction="row" justifyContent="space-between" mt={2} sx={{background: "#FFF", p:1 }}>
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
                onClick={() => refreshPreview()}
              >
                Render preview
              </Button>
            </Stack>
          </Stack>
        </ContentHeader>
        <Box height="100%" display="flex" gap={2} justifyContent="space-between" >
          <Box height="100%" width="75%" display="flex">
            <Box width="100%" display={editorMode === "ui" ? "none" : "flex"}>
              <CodeEditor
                value={schemeTextArea}
                language="js"
                placeholder="Please enter JS code."
                onChange={(e) => {setSchemeTextArea(e.target.value); refreshPreview()}}
                padding={15}
                style={{
                  width: "100%",
                  fontSize: textSize,
                  backgroundColor: "#FFF",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
              />
              {/* <FullscreenTextArea
                value={schemeTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => {setSchemeTextArea(e.target.value); refreshPreview()}} /> Add tab indent support */}
            </Box>
            <Box width="100%" display={editorMode === "scheme" ? "none" : "flex"}>
              <CodeEditor
                value={uiTextArea}
                language="js"
                placeholder="Please enter JS code."
                onChange={(e) => {setUiTextArea(e.target.value); refreshPreview()}}
                padding={15}
                style={{
                  borderLeft: "1px solid #CCC",
                  width: "100%",
                  fontSize: textSize,
                  backgroundColor: "#FFF",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
              />
              {/* <FullscreenTextArea
                value={uiTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => {setUiTextArea(e.target.value); refreshPreview()}} /> */}
            </Box>
          </Box>
          <Box flex="1">
            {loading ? (
              <Box height={"100%"} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress size={80} />
              </Box>
            ) : (
              <FormsWrapped data={{}} setData={() => {}} schema={schemeTextArea} uischema={uiTextArea}/>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
};

export default TemplateEditor;