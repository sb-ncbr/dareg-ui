import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../Components/ContentHeader';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import { useFetch } from 'use-http';
import DaregTable from '../../Components/EntityTable/EntityTable';
import { TemplatesData } from '../../types/global';

const TemplateList = () => {

  const [ data, setData ] = useState<TemplatesData[]>();
  const { get } = useFetch(`/templates`);
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const projects = await get()
      setData(projects)
    })()
  }, [get])

  const tableColumns = [
    { id: 'name', label: 'Name', width: 200 },
    { id: 'description', label: 'Description', width: 400 },
    { id: 'default_template', label: 'Tags', width: 200 },
    { id: 'creator', label: 'Creator', width: 200 },
    { id: 'created_at', label: 'Creation', width: 200 },
    { id: 'actions', label: 'Actions', width: 200, renderCell: (params: any) => (
      <Button variant="contained" size="small" onClick={() => navigate(`/templates/${params.id}`)}>View</Button>
    )}
  ]

  return (
    <Box>
      <ContentHeader title={"Templates"} actions={
        <Button variant="contained" size="small" endIcon={<PostAddRounded />} onClick={() => navigate("/templates/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        <DaregTable columns={tableColumns} data={data || []} />
      </ContentCard>
    </Box>
  );
}

export default TemplateList;

