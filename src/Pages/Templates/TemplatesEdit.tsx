import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DesignServices, Save } from "@mui/icons-material";
import TemplateEditor, { TemplateEditorState } from "../../Components/TemplateEditor";
import { useEffect, useState } from "react";
import FormsWrapped from "../../Components/FormsWrapped";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import { useFetch } from "use-http";
import { TemplatesData } from "./TemplateList";

type TemplateEditorStateKeys = keyof TemplatesData | 'full-editor';

const TemplatesNew = ({editMode}: {editMode: boolean}) => {

    const navigate = useNavigate();
    
    const [templateEditorState, setTemplateEditorState] = useState<boolean>(false)
    const [data, setData] = useState<TemplatesData>({id: "", creator: "", created_at: "", name: "", description: "", uischeme: "", scheme: ""})
    
    const { templateId } = useParams();
    const {get, post, patch, response, loading, error } = useFetch(`/templates`);

    useEffect(() => {
        const tmp = async () => {
            const tmp = await get(`/${templateId}`);
            setData(tmp)
        }
        if(editMode){
            tmp()
        }
    }, [])

    const openEditor = (type: TemplateEditorStateKeys): void => {
        switch(type){
            case "uischeme":
                break;
            case "scheme":
                break;
            case "full-editor":
                setTemplateEditorState(true)
                break;
            default:
                break;
        }
    }

    const handleChange = (inputId: TemplateEditorStateKeys, e: any): void => {
        console.log(e)
        setData({
            ...data,
            [inputId]: e.target.value
        })
    }

    const closeEditor = ():void => {
        setTemplateEditorState(false);
    }

    const saveForm = (): void => {
        let updatedTemplate;
        if(editMode){
            console.log("Patching,...", data)
            updatedTemplate = patch(`/${templateId}`, data).then((response) => {navigate(`/templates/${templateId}`)})
        } else {
            updatedTemplate = post(data).then((response) => {navigate(`/templates/${response.id}`)})
        }
    }

    return (
      <Box>
        <ContentHeader title={`Template: ${editMode ? "Edit" : "Create"}`}>
            <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Template name"
                    fullWidth
                    variant="filled"
                    value={data.name}
                    onChange={(e) => handleChange("name", e)}
                    sx={{maxWidth: "33.33%", background: "#FFF"}}
                    />
                <TextField
                    margin="dense"
                    label="Template description"
                    fullWidth
                    variant="filled"
                    value={data.description}
                    onChange={(e) => handleChange("description", e)}
                    sx={{maxWidth: "66.67%", background: "#FFF"}}
                    />
            </Stack>
        </ContentHeader>
        <ContentCard title={"Edit templates"}>
            <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                {/* <Button onClick={() => openEditor("data-schema")}>
                    <Paper sx={{p:5}}>
                        <Schema fontSize="large"></Schema>
                        <Typography sx={{fontWeight: "bold"}} variant="body1">JSON Schema</Typography>
                    </Paper>
                </Button>
                <Button onClick={() => openEditor("ui-schema")}>
                    <Paper sx={{p:5}}>
                        <ArtTrack fontSize="large" />
                        <Typography sx={{fontWeight: "bold"}} variant="body1">UI JSON Schema</Typography>
                    </Paper>
                </Button> */}
                <Button onClick={() => openEditor("full-editor")}>
                    <Paper sx={{p:5}}>
                        <DesignServices fontSize="large" />
                        <Typography sx={{fontWeight: "bold"}} variant="body1">Templates Editor</Typography>
                    </Paper>
                </Button>
            </Stack>
            <TemplateEditor data={data} setData={setData} open={templateEditorState} closeSelf={closeEditor} />
        </ContentCard>

        <ContentCard title={"Preview"}>
            {(data.scheme || data.uischeme) ? 
            <FormsWrapped schema={data.scheme} uischema={data.uischeme} data={{}} setData={() => {}} />
            : <>No schema defined, use "Edit templates" section</>}
        </ContentCard>

        {/* <ContentCard title={"Permissions"} actions={
            <Button variant="outlined" startIcon={<GroupAdd />}>
                    Add user/group
                </Button>
            }>
        <PermissionsTable />
        </ContentCard> */}
        <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
            <Button variant="contained" size="large" endIcon={<Save />} onClick={() => saveForm()}>
                Save
            </Button>
        </ContentCard>
        {error ? <Typography variant="subtitle1">{error.message || ""}</Typography> : <p></p>}
      </Box>
    )
}

export default TemplatesNew