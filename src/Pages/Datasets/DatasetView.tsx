import { DataObject, Edit, Save } from "@mui/icons-material";
import { Box, Button, Divider, Stack, TextField } from "@mui/material";
import ContentHeader from "../../Components/ContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import FormsWrapped from "../../Components/FormsWrapped";
import { TemplateEditorState } from "../../Components/TemplateEditor";
import useFetch from "use-http";
import { ProjectsData } from "../Projects/ProjectList";
import { ProjectDataStateKeys } from "../Projects/ProjectEdit";
import { parse, stringify } from 'yaml'

type AvailableViewModes = 'edit' | 'view' | 'new';

const ObjectMode = (mode: AvailableViewModes) => {
    const mapping = {
        'edit': "Edit",
        'view': "View",
        'new': "Create"
    }
    return mapping[mode];
}

type FormData = {
    id?: string,
    node: string,
    used_template: string,
    data: string,
    creator?: string,
    created_at?: string

}

const DatasetView = ({mode}: {mode: 'edit' | 'view' | 'new'}) => {

    const navigate = useNavigate();
    const { projectId, datasetId } = useParams();
    
    const [ template, setTemplate ] = useState<TemplateEditorState>();
    const [ data, setData ] = useState<ProjectsData>({name: "", description: "", default_template: "", created_at: "", creator: "", upper: projectId});
    const [ formData, setFormData ] = useState<FormData>({node: "", data: "{}", used_template: "", });
    const [ formDataString, setFormDataString ] = useState({})
    const [ project, setProject ] = useState<ProjectsData>();

    const { get, post, patch } = useFetch();

    useEffect(() => {
        (async () => {
            const project = await get(`/nodes/${projectId}`)
            setProject(project)
            const template = await get(`/templates/${project.default_template}`)
            setTemplate(template)
            if (mode==='view'){
                const node_data = await get(`/nodes/${datasetId}`)
                setData(node_data)
                const form_data = await get(`/form?node=${datasetId}`)
                console.log(form_data)
                setFormData(formData)
                setFormDataString(JSON.parse(formData.data))
                }
            })()
    }, [])

    const saveForm = (): void => {
        let updatedTemplate;
        switch(mode){
            case 'edit':
                console.log(data)
                updatedTemplate = patch(`/nodes/${datasetId}`, {...data, upper: projectId})
                    .then((response) => {
                        return patch(`/form/${formData.id}`, {id: formData?.id, data: formData.data, node: response.id, used_scheme: template?.id});
                        navigate(`/projects/${projectId}/datasets/${datasetId}`)
                    })
                break;
            case 'new':
                updatedTemplate = post(`/nodes`, {...data, default_template: project?.default_template})
                .then((response) => {
                    console.log(template, project, formData)
                    return post(`/form`, {data: formData.data, node: response.id, used_template: template?.id})
                })
                .then((response) => {console.log(response); navigate(`/projects/${projectId}/datasets/${response.id}`)})
                break;
        }
    }

    useEffect(() => {
        setFormData({
            ...formData,
            data: JSON.stringify(formDataString)
        })
    }, [formDataString])

    const handleChange = (inputId: ProjectDataStateKeys, e: any): void => {
        if(!inputId){ 
            return 
        }
        setData({
            ...data,
            [inputId]: e.target.value
        })
    }

    console.log(formData.data)

    const downloadMetadata = (): void => {
        const element = document.createElement("a");
        const file = new Blob([stringify(formData)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${data.name || data.id}-${(new Date()).toISOString()}.metadata.yaml`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    console.log(formData)
    return (
        <Box>
            <ContentHeader title={`Dataset: ${ObjectMode(mode)}`} actions={
                        mode==='view' ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/edit`)}>
                            Edit
                        </Button>) : <></>
                    }>
                <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Dataset name"
                        fullWidth
                        variant="filled"
                        value={data?.name}
                        onChange={(e) => handleChange("name", e)}
                        sx={{maxWidth: "33.33%", background: "#FFF"}}
                        disabled={mode==='view'}
                        />
                    <TextField
                        margin="dense"
                        label="Dataset description"
                        fullWidth
                        variant="filled"
                        value={data?.description}
                        onChange={(e) => handleChange("description", e)}
                        sx={{maxWidth: "66.67%", background: "#FFF"}}
                        disabled={mode==='view'}
                        />
                </Stack>
            </ContentHeader>
            <ContentCard title={"Metadata"}>
                <FormsWrapped  readonly={mode==='view'} schema={template?.scheme || ""} uischema={template?.uischeme || ""} data={formDataString} setData={setFormDataString} />
            </ContentCard>
            <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
                {mode==='view' ? <></> : (
                    <Button variant="contained" size="large" endIcon={<Save />} onClick={() => saveForm()}>
                        Save
                    </Button>
                )}
                <Button sx={{ml:2}} disabled={formData.data==="{}"} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                    Download metadata
                </Button>
            </ContentCard>
        </Box>
    )
}

export default DatasetView;