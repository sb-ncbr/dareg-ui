import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import { Add, Edit, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import FormsWrapped from "../../Components/FormsWrapped";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import { useFetch } from "use-http";
import { ProjectsData } from "./ProjectList";
import TemplateSelect from "../../Components/TemplateSelect";
import { TemplatesData } from "../Templates/TemplateList";
import { LoadingButton } from "@mui/lab";
import DaregTable from "../../Components/EntityTable/EntityTable";

export type ProjectDataStateKeys = keyof ProjectsData;

export type AvailableViewModes = 'edit' | 'view' | 'new';

const ObjectMode = (mode: AvailableViewModes) => {
    const mapping = {
        'edit': "Edit",
        'view': "View",
        'new': "Create"
    }
    return mapping[mode];
}

const ProjectEdit = ({mode}: {mode: 'edit' | 'view' | 'new'}) => {

    const navigate = useNavigate();
    const [data, setData] = useState<ProjectsData>({name: "", description: "", default_template: "", created_at: "", creator: "", upper: null})
    const [selectedTemplate, setSelectedTemplate] = useState<any>()
    const [ templateData, setTemplateData ] = useState<TemplatesData>();
    const [ datasets, setDatasets ] = useState<ProjectsData[]>();

    const [ loadingButtonState, setLoadingButtonState ] = useState<boolean>(false)
    
    const { projectId } = useParams();
    const { get, post, patch } = useFetch();

    useEffect(() => {
        if(mode==='view' || mode==='edit'){
            (async () => {
                const tmp = await get(`/nodes/${projectId}`);
                setData(tmp)
            })();
            (async () => {
                const tmp2 = await get(`/nodes?upper=${projectId}`);
                setDatasets(tmp2)
            })()
        }
    }, [])

    useEffect(() => {
        if(mode==='edit' || mode==='new'){
            (async () => {
                setTemplateData(await get(`/templates/${selectedTemplate?.id}`))
            })()
            setData({...data, default_template: selectedTemplate?.id})
        }
    }, [selectedTemplate])

    useEffect(() => {
        if(data.default_template){
            (async () => {
                setTemplateData(await get(`/templates/${data?.default_template}`))
            })()
        }
    }, [data])

    const saveForm = (): void => {
        let updatedTemplate;
        setLoadingButtonState(true);
        switch(mode){
            case 'edit':
                updatedTemplate = patch(`/nodes/${projectId}`, data)
                break;
            case 'new':
                updatedTemplate = post(`/nodes`, data)
                break;
        }
        updatedTemplate?.then((response) => {
            setLoadingButtonState(false)
            navigate(`/projects/${projectId}`)
        })
    }

    const handleChange = (inputId: ProjectDataStateKeys, e: any): void => {
        if(!inputId){ 
            return 
        }
        setData({
            ...data,
            [inputId]: e.target.value
        })
    }
    
    const datasetsTable = [
        { id: 'name', label: 'Name', width: 200 },
        { id: 'description', label: 'Description', width: 400 },
        { id: 'default_template', label: 'Tags', width: 200 },
        { id: 'creator', label: 'Creator', width: 200 },
        { id: 'created_at', label: 'Creation', width: 200 },
        { id: 'actions', label: 'Actions', width: 200, renderCell: (params: any) => (
            <Button variant="contained" size="small" onClick={() => navigate(`/projects/${projectId}/datasets/${params.id}`)}>View</Button>
        )}
    ]

    if (data){
        return (
            <Box>
                <ContentHeader title={`Project: ${ObjectMode(mode)}`} actions={
                            mode==='view' ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/projects/${data?.id}/edit`)}>
                                Edit
                            </Button>) : <></>
                        }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Project name"
                            fullWidth
                            variant="filled"
                            value={data?.name}
                            onChange={(e) => handleChange("name", e)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode==='view'}
                            />
                        <TextField
                            margin="dense"
                            label="Project description"
                            fullWidth
                            variant="filled"
                            value={data?.description}
                            onChange={(e) => handleChange("description", e)}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            disabled={mode==='view'}
                            />
                    </Stack>
                </ContentHeader>
                {mode==='view' ? (
                    <ContentCard title={"Datasets"} actions={
                        <Button variant={"contained"} size="medium" endIcon={<Add />} onClick={() => navigate(`/projects/${data?.id}/datasets/new`)}>
                            New Dataset
                        </Button>
                    }>
                        <DaregTable columns={datasetsTable} data={datasets || []} size="small"/>
                    </ContentCard>
                ) : <></>}
                
                {mode==='view' ? <></> : (<ContentCard title={"Select default template"}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                        <TemplateSelect selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/>
                    </Stack>
                </ContentCard>)}

                <ContentCard title={"Preview"}>
                    {(true) ? 
                    <FormsWrapped readonly schema={templateData?.scheme || ""} uischema={templateData?.uischeme || ""} data={{}} setData={() => {}} />
                    : <>No schema defined, use "Edit templates" section</>}
                </ContentCard>
                {mode==='view' ? <></> : (<ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
                    <LoadingButton
                        loading={loadingButtonState}
                        loadingPosition="end"
                        endIcon={<Save />}
                        variant="contained"
                        size="large"
                        onClick={() => saveForm()}
                        >
                        Save
                    </LoadingButton>
                </ContentCard>)}
                {/* {error ? <Typography variant="subtitle1">{error.message || ""}</Typography> : <p></p>} */}
            </Box>
        )
    } else {
        return (
            <Box>
                <ContentHeader title={"Template: View"} actions={
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
                <ContentCard title={"Form"}>
                    <Skeleton />
                </ContentCard>
            </Box>
        )
    }
}

export default ProjectEdit