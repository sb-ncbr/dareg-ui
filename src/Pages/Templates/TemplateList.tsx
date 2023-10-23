import { Box, Button, Skeleton, Typography } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import ListLink from '../../Components/ListLink';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../Components/ContentHeader';
import { PostAddRounded } from '@mui/icons-material';
import ContentCard from '../../Components/ContentCard';
import { useFetch } from 'use-http';

export type TemplatesData = {
  id?: string, name: string, description: string, scheme: string, uischeme: string, created_at?: string, creator?: string
}

const TemplateList = () => {

  const [ data, setData ] = useState<TemplatesData[]>();
  const {get, post, patch, response, loading, error } = useFetch(`/templates`);
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const projects = await get()
      setData(projects)
    })()
  }, [])

  return (
    <Box>
      <ContentHeader title={"Templates"} actions={
        <Button variant="contained" size="small" endIcon={<PostAddRounded />} onClick={() => navigate("/templates/new")}>
          Add new
        </Button>
      }>
      </ContentHeader>
      <ContentCard>
        {!data ? (
          <>
          {[0,1,2,3,4,5,6].map((item: number) => <Skeleton />)}
          </>
        ) : (
          <>
          {data?.map((item: TemplatesData) => <ListLink name={item.name} key={item.name} username={item?.creator || ""} date={item?.created_at || ""} disabled={false} onClick={() => navigate("/templates/"+item.id)}></ListLink>)}
          </>
        )}
      </ContentCard>
    </Box>
  );
}

export default TemplateList;

