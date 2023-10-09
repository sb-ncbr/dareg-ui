import React, { ReactElement, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Switch, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';

import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import bull from './Bull';
import CardHeader from './CardHeader';
import TemplateSelect from './TemplateSelect';
import CardTable from './CardTable';
import FormsWrapped from './FormsWrapped';
import NewDataset from './NewDataset';
import request from '../Utils/Request';

const ListCard = (props: {
  closeSelf: () => void,
  current: { id: string, name: string, descr: string, defaultTemplateID: string },
  clickRow: (id: string) => void
}) => {

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [nodeList, setNodeList] = useState<any>([])

  useEffect(() => {
    request("/get_nodes", {
      upper: props.current.id
    }, (response) => {
      setNodeList(response)
    })
  }, [props.current])

  const { t } = useTranslation()

  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const [newSchemeOpen, setNewSchemeOpen] = useState(false)
  const [templateSelectOpen, setTemplateSelectOpen] = useState(false)
  const [projectSettingsOpen, setProjectSettingsOpen] = useState(false)

  return (
    <ListCardBase>
      <Box>
        <CardHeader
          closeSelf={props.closeSelf}
          openSettings={() => setProjectSettingsOpen(true)}
          path={[{ name: "Projekty", url: "" }]}
          current={props.current.name}
          descr={props.current.descr}
          settingsButtonText="Nastavení projektu"
        />

        <Card variant="elevation" elevation={2} sx={{mt: 3, mb: 3, p: 3, pt: 2}}>
          <Typography fontSize={28} variant="h6">Datasety</Typography>
          <CardTable clickRow={props.clickRow} rows={nodeList} addButtonText="Přidat dataset" addButtonClick={() => setNewDatasetOpen(true)} />
        </Card>

      </Box>

      <Dialog fullScreen open={newDatasetOpen} onClose={() => setNewDatasetOpen(false)}>
        <NewDataset currentProject={props.current} closeSelf={() => setNewDatasetOpen(false)}/>
      </Dialog>

      <Dialog fullWidth open={newSchemeOpen} onClose={() => setNewSchemeOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Přidat schéma na této úrovni</Typography>
          <TextField
            margin="dense"
            id="name"
            label="Název"
            fullWidth
            variant="outlined"
            helperText="Při nezadání názvu se jako název použije název šablony"
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="outlined"
            multiline
            rows="3"
            sx={{ mb: 2 }}
          />
          {/*<TemplateSelect selectedTemplate='' setSelectedTemplate={(none) => {}}/>*/}
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setNewSchemeOpen(false)}>Zrušit</Button>
            <Button sx={{ ml: 2 }} variant='contained' onClick={() => setNewSchemeOpen(false)}>Pokračovat</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog fullWidth open={projectSettingsOpen} onClose={() => setProjectSettingsOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Nastavení projektu</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Název"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="outlined"
            multiline
            rows="3"
            sx={{ mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 2 }}>Výchozí šablona pro datasety</Typography>
          {/*<TemplateSelect selectedTemplate='' setSelectedTemplate={(none) => {}}/>*/}
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setProjectSettingsOpen(false)}>Zrušit</Button>
            <Button sx={{ ml: 2 }} variant='contained' onClick={() => setProjectSettingsOpen(false)}>Uložit</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  );
}

export default ListCard;
