import React, { ReactElement, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Switch, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { Add, AddRounded, AddToHomeScreen, BackspaceRounded, Close, CodeRounded, ContentCopyRounded, CreateNewFolderRounded, DeleteForeverRounded, DocumentScannerRounded, EditRounded, HistoryRounded, KeyboardBackspaceRounded, ModeEdit, NavigateNextRounded, PostAddRounded, SaveRounded, UndoRounded } from '@mui/icons-material';
import { JsonForms } from '@jsonforms/react';

import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import CardButton from './CardButton';
import CardHeader from './CardHeader';
import TemplateSelect from './TemplateSelect';
import FormsWrapped from './FormsWrapped';

const ProjectsSchemeCard = (props: { closeSelf: () => void }) => {
  const [editingForm, setEditingForm] = useState(false)

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { t } = useTranslation()

  const [templateSelectOpen, setTemplateSelectOpen] = useState(false)

  return (
    <ListCardBase>
      <CardHeader closeSelf={props.closeSelf} disableDuplicate path={[]} current='' descr='' />
      <Divider sx={{ mb: 1 }}>plants_schema_2023 (<Link onClick={() => setTemplateSelectOpen(true)}>změnit</Link>)</Divider>
      <FormsWrapped schema={"{}"} uischema={"{}"} />
      <Box mt={2} display="flex" justifyContent="flex-end">
        {editingForm
          ?
          <>
            <CardButton onClick={() => setEditingForm(false)} startIcon={<SaveRounded />} >
              {t("ListCard.save")}
            </CardButton>
            <CardButton onClick={() => setEditingForm(false)} startIcon={<UndoRounded />} >
              {t("ListCard.revertChanges")}
            </CardButton>
          </>
          :
          <CardButton onClick={() => setEditingForm(true)} startIcon={<ModeEdit />} >
            {t("ListCard.editForm")}
          </CardButton>
        }
        <CardButton startIcon={<CodeRounded />} >
          {t("ListCard.downloadJSON")}
        </CardButton>
      </Box>
      <Dialog fullWidth open={templateSelectOpen} onClose={() => setTemplateSelectOpen(false)}>
        <DialogContent>
          <TemplateSelect />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setTemplateSelectOpen(false)}>Zrušit</Button>
            <Button sx={{ ml: 2 }} variant='contained' onClick={() => setTemplateSelectOpen(false)}>Vybrat</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  );
}

export default ProjectsSchemeCard;
