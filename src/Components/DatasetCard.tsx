import React, { ReactElement, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Switch, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { Add, AddRounded, AddToHomeScreen, BackspaceRounded, Close, CodeRounded, ColorLensOutlined, ContentCopyRounded, CreateNewFolderRounded, DeleteForeverRounded, DocumentScannerRounded, EditRounded, HistoryRounded, KeyboardBackspaceRounded, ModeEdit, NavigateNextRounded, PostAddRounded, SaveRounded, UndoRounded } from '@mui/icons-material';
import { JsonForms } from '@jsonforms/react';

import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import CardButton from './CardButton';
import CardHeader from './CardHeader';
import TemplateSelect from './TemplateSelect';
import FormsWrapped from './FormsWrapped';

const DatasetCard = (props: {
  closeSelf: () => void,
  currentDataset: {name: string, descr: string, scheme: string, ui_scheme: string, data: string}
}) => {
  const [editingForm, setEditingForm] = useState(false)

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { t } = useTranslation()

  const [templateSelectOpen, setTemplateSelectOpen] = useState(false)
  
  const loadJSON = (json: string) => {
    try {
      return (JSON.parse(json))
    }
    catch {  }
  }  

  const [data, setData] = useState<any>();

  useEffect(() => {
    setData(loadJSON(props.currentDataset.data))
  }, [props.currentDataset])

  return (
    <ListCardBase>
      <CardHeader settingsButtonText="Nastavení datasetu" openSettings={() => {}} closeSelf={props.closeSelf} disableDuplicate path={[]} current={props.currentDataset.name} descr={props.currentDataset.descr} />
      <Paper variant="outlined" sx={{ mt: 3, p: 3, pt: 2 }}>
        <FormsWrapped data={data} setData={setData} schema={props.currentDataset.scheme} uischema={props.currentDataset.ui_scheme} />
      </Paper>
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
        <CardButton
          onClick={() => {
            const blob = new Blob([JSON.stringify(data)], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `${props.currentDataset.name}.txt`;
            link.href = url;
            link.click();
          }}
          startIcon={<CodeRounded />} >
          {t("ListCard.downloadJSON")}
        </CardButton>
      </Box>
      <Dialog fullWidth open={templateSelectOpen} onClose={() => setTemplateSelectOpen(false)}>
        <DialogContent>
          {/*<TemplateSelect selectedTemplate='' setSelectedTemplate={(none) => {}}/>*/}
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setTemplateSelectOpen(false)}>Zrušit</Button>
            <Button sx={{ ml: 2 }} variant='contained' onClick={() => setTemplateSelectOpen(false)}>Vybrat</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  );
}

export default DatasetCard;
