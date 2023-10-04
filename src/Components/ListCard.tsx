import React, { ReactElement, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Switch, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { Add, AddRounded, AddToHomeScreen, BackspaceRounded, Close, CodeRounded, ContentCopyRounded, CreateNewFolderRounded, DeleteForeverRounded, DocumentScannerRounded, EditRounded, HistoryRounded, KeyboardBackspaceRounded, ModeEdit, NavigateNextRounded, PostAddRounded, SaveRounded, UndoRounded } from '@mui/icons-material';

import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import bull from './Bull';
import CardHeader from './CardHeader';
import TemplateSelect from './TemplateSelect';
import CardTable from './CardTable';

const ListCard = (props: {
  closeSelf: () => void,
  current: { id: string, name: string, descr: string }
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { t } = useTranslation()

  const [newDatasetOpen, setNewDatasetOpen] = useState(false)
  const [newSchemeOpen, setNewSchemeOpen] = useState(false)
  const [templateSelectOpen, setTemplateSelectOpen] = useState(false)

  return (
    <ListCardBase>
      <Box>
        <CardHeader closeSelf={props.closeSelf} path={[{ name: "Projekty", url: "" }]} current={props.current.name} descr={props.current.descr} />

        <Divider sx={{ mb: 1, mt: 1 }}><Typography variant="h6" fontWeight={400}>Datasety</Typography></Divider>
        <CardTable addButtonText="Přidat dataset" addButtonClick={() => setNewDatasetOpen(true)} />

        <Divider sx={{ mb: 1, mt: 1 }}><Typography variant="h6" fontWeight={400}>Schémata na této úrovni</Typography></Divider>
        <CardTable addButtonText="Přidat schéma na této úrovni" addButtonClick={() => setNewSchemeOpen(true)} />


      </Box>

      <Dialog fullWidth open={newDatasetOpen} onClose={() => setNewDatasetOpen(true)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Přidat dataset</Typography>
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
          />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setNewDatasetOpen(false)}>Zrušit</Button>
            <Button
              sx={{ ml: 2 }}
              variant='contained'
              onClick={() => setNewDatasetOpen(false)}
            >
              Přidat
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog fullWidth open={newSchemeOpen} onClose={() => setNewSchemeOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Přidat schéma na této úrovni</Typography>
          <TextField
            autoFocus
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
          <TemplateSelect />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setNewSchemeOpen(false)}>Zrušit</Button>
            <Button sx={{ ml: 2 }} variant='contained' onClick={() => setNewSchemeOpen(false)}>Pokračovat</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  );
}

export default ListCard;
