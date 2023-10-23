import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import ContentHeader from '../../Components/ContentHeader';
import { useFetch } from 'use-http';
import DaregTable from '../../Components/EntityTable/EntityTable';

export type ProjectsData = {
  id?: string,
  name: string,
  description: string,
  upper?: string | null,
  default_template: string,
  creator: string,
  created_at: string,
}

const ProjectsList = () => {

  const {get, loading } = useFetch(`/nodes?upper=null`);
  const [ data, setData ] = useState<ProjectsData[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const projects = await get().catch((e) => console.log(e))
      setData(projects)
    })()
  }, [])

  const tableColumns = [
    { id: 'name', label: 'Name', width: 200 },
    { id: 'description', label: 'Description', width: 400 },
    { id: 'default_template', label: 'Tags', width: 200 },
    { id: 'creator', label: 'Creator', width: 200 },
    { id: 'created_at', label: 'Creation', width: 200 },
    { id: 'actions', label: 'Actions', width: 200, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/projects/${params.id}`)}>View</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader title={"Projects"} actions={
        <Button variant="contained" size="small" endIcon={<PostAddRounded />} onClick={() => navigate("/projects/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        <DaregTable
          columns={tableColumns}
          data={data}
        />
      </ContentCard>
    </Box>
  );
}

export default ProjectsList;

