import { FC, ReactFragment } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ListCardBase = (props: {children: ReactFragment}) => {
  return (
    <Card sx={{marginTop: 2}} variant="outlined" >
      <Box sx={{ overflowY: "auto" }} maxHeight="calc(100vh - 64px - 1rem)">
        <CardContent>
          {props.children}
        </CardContent>
      </Box>
    </Card>
  );
}

export default ListCardBase;
