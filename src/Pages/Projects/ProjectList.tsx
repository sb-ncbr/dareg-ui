import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ListLink from '../../Components/ListLink';
import { useNavigate } from 'react-router-dom';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import ContentHeader from '../../Components/ContentHeader';
import useApi from '../../Utils/useApi';
import { useFetch } from 'use-http';

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

  // const [ dataApi, isLoading, error, callApi ] = useApi<{data: ProjectsData}>("/api/nodes", {method: 'GET', params: {"upper": null}});
  const {get, post, patch, response, loading, error } = useFetch(`/nodes?upper=null`);
  const [ data, setData ] = useState<ProjectsData[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const projects = await get()
      setData(projects)
    })()
  }, [])

  return (
    <Box>
      <ContentHeader title={"Projects"} actions={
        <Button variant="contained" size="small" endIcon={<PostAddRounded />} onClick={() => navigate("/projects/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        {loading ? <Typography>Loading...</Typography> : (
          <>
          {data?.map((item: ProjectsData) => <ListLink name={item.name} key={item.name} username={item.creator} date={item.created_at} disabled={false} onClick={() => navigate("/projects/"+item.id)}></ListLink>)}
          </>
        )}
      </ContentCard>
    </Box>
  );
}

export default ProjectsList;

