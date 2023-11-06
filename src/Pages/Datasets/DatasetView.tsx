import { DataObject, Edit, Save } from "@mui/icons-material";
import { Alert, Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import ContentHeader from "../../Components/ContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import FormsWrapped from "../../Components/FormsWrapped";
import useFetch from "use-http";
import { ProjectDataStateKeys } from "../Projects/ProjectEdit";
import { stringify } from 'yaml'
import { DatasetsData, FormData, ProjectsData } from "../../types/global";
import { ViewModes } from "../../types/enums";

type Props = {
    mode: ViewModes
}

const DatasetView = ({mode}: Props) => {

    const navigate = useNavigate();
    const { get, post, patch, loading } = useFetch();

    const { projectId, datasetId } = useParams();

    const [ data, setData ] = useState<DatasetsData>({dataset: {name: "", description: ""}, form: {data: "{}"}, template: {uischeme: "", scheme: ""}} as DatasetsData);
    const [ formDataString, setFormDataString ] = useState({})
    const [ error, setError ] = useState<boolean>(false)

    const [ editorMode, setEditorMode ] = useState<"form"|"editor">("form")
    const toggleEditor = useCallback(() => setEditorMode((prevState) => prevState==="form" ? "editor" : "form"), [])

    useEffect(() => {
        (async () => {
          await get(`/nodes/${projectId}`)
            .then((response: ProjectsData): ProjectsData => {
              setData((prevState) => ({
                ...prevState,
                project: response
              }));
              return response
            })
            .then((r) => get(`/templates/${r.default_template}`))
            .then((response) => {
              setData((prevState) => ({
                ...prevState,
                template: response
              }));
            })
            .catch((error) => {
              console.log(error)
            });
            if (mode===ViewModes.View || mode===ViewModes.Edit){
                await get(`/nodes/${datasetId}`)
                .then((response) => {
                    setData((prevState) => ({
                        ...prevState,
                        dataset: response
                    }));
                })
                .then(() => {
                    return get(`/form?node=${datasetId}`);
                })
                .then((response) => {
                    setData((prevState) => ({
                        ...prevState,
                        form: response
                    }))
                    return JSON.parse(response.data)
                })
                .then((formData) => {
                    setFormDataString(formData)
                })
                .catch((error) => {
                    setError(true)
                    console.log(error)
                });
            }
        })()
    }, [datasetId, projectId, get, mode]);

    const saveForm = (): void => {
        switch(mode){
            case ViewModes.Edit:
                patch(`/nodes/${datasetId}`, {name: data.dataset.name, description: data.dataset.description})
                .then((response) => (patch(`/form/${data.form.id}`, {...data.form}))
                .then((response) => {
                    navigate(`/projects/${projectId}/datasets/${datasetId}`, {replace: true})
                }))
                break;
            case ViewModes.New:
                post(`/nodes`, {
                    name: data.dataset.name, 
                    description: data.dataset.description, 
                    default_template: data.project.default_template, 
                    upper: data.project.id
                })
                .then((response) => {
                    return [response.id, post(`/form/`, {data: data.form.data, node: response.id, used_template: data.template.id})]
                })
                .then(([id, response]) => {console.log(response); navigate(`/projects/${projectId}/datasets/${id}`)})
                break;
        }
    }

    const handleChange = (inputId: ProjectDataStateKeys | keyof FormData, dataset: keyof DatasetsData, e: any): void => {
        if(!inputId){ 
            return 
        }
        setData({
            ...data,
            [dataset]: {
                ...data[dataset],
                [inputId]: e.target.value
            }
        })
    }

    useEffect(() => {
        setData((prevState) => {
            return {
                ...prevState,
                form: {
                    ...prevState.form,
                    data: JSON.stringify(formDataString)
                },
            }
        })
    }, [formDataString])

    useEffect(() => {
        try{
            setFormDataString(JSON.parse(data.form.data))
        } catch (e) {
            console.log(e, data.form.data)
            setFormDataString({})
        }
    }, [data.form.data])

    const downloadMetadata = (): void => {
        const element = document.createElement("a");
        const file = new Blob([stringify(JSON.parse(data.form.data))], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${data.dataset.name || data.dataset.id}-${(new Date()).toISOString()}.metadata.yaml`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    if (!loading){
        return (
            <Box>
                <ContentHeader title={`Dataset: ${mode}`} actions={
                            mode===ViewModes.View ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/edit`)}>
                                Edit
                            </Button>) : <></>
                        }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Dataset name"
                            fullWidth
                            required
                            variant="filled"
                            value={data.dataset.name}
                            onChange={(e) => handleChange("name", "dataset", e)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                        <TextField
                            margin="dense"
                            label="Dataset description"
                            fullWidth
                            variant="filled"
                            value={data.dataset.description}
                            onChange={(e) => handleChange("description", "dataset", e)}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    </Stack>
                </ContentHeader>
                <ContentCard title={"Metadata"} actions={
                    <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                        Switch Editor
                    </Button>
                }>
                    {error ? (
                        <Alert sx={{mb:2}} severity="warning">
                            There might be a problem with metadata! Switch to the text editor instead?
                            <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                                Switch
                            </Button>
                        </Alert>
                    ) : <></> }
                    {editorMode==='form' ? (
                        data.template.scheme && data.template.uischeme ? (
                            <FormsWrapped  readonly={mode===ViewModes.View} schema={data.template.scheme} uischema={data.template.uischeme} data={formDataString} setData={setFormDataString} />
                        ) : <>S</>
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Metadata"
                            fullWidth
                            multiline
                            rows={20}
                            required
                            variant="filled"
                            value={data.form.data}
                            onChange={(e) => handleChange("data", "form", e)}
                            sx={{maxWidth: "100%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    )}
                </ContentCard>
                <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
                    <Stack gap={2} direction="row" justifyContent="flex-start">
                        {mode===ViewModes.View ? <></> : (
                            <Button variant="contained" size="large" endIcon={<Save />} onClick={() => saveForm()}>
                                Save
                            </Button>
                        )}
                        <Button  disabled={data.form.data==="{}"} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                            Download metadata
                        </Button>
                    </Stack>
                </ContentCard>
            </Box>
        )
    } else {
        return (
            <Box>
                <ContentHeader title={`Dataset: ${mode}`} actions={
                    <Skeleton>
                        <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => {}}>
                            Edit
                        </Button>
                    </Skeleton>
                    }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <Skeleton width={"33%"}>
                            <TextField
                            autoFocus
                            margin="dense"
                            label="Template name"
                            fullWidth
                            variant="filled"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            />
                        </Skeleton>
                        <Skeleton width={"67%"}>
                        <TextField
                            margin="dense"
                            label="Template description"
                            fullWidth
                            variant="filled"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            />
                        </Skeleton>
                    </Stack>
                </ContentHeader>
                <ContentCard title={"Metadata"}>
                    <Skeleton width={"100%"} height={"4em"}/>
                    <Skeleton width={"100%"} height={"3em"}/>
                    <Skeleton width={"100%"} height={"3em"}/>
                    <Skeleton width={"75%"} height={"2em"}/>
                    <Skeleton width={"50%"} height={"2em"}/>
                    <Skeleton width={"25%"} height={"2em"}/>
                </ContentCard>
                <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
                    <Stack gap={2} direction="row" justifyContent="flex-start">
                        <Skeleton width={"5%"} height={"4em"}>
                        {mode===ViewModes.View ? <></> : (
                            <Button variant="contained" size="large" endIcon={<Save />} onClick={() => saveForm()}>
                                Save
                            </Button>
                        )}
                        </Skeleton>
                        <Skeleton>
                            <Button  disabled={data.form?.data==="{}"} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                                Download metadata
                            </Button>
                        </Skeleton>
                    </Stack>
                </ContentCard>
            </Box>
        )
    }
}

export default DatasetView;