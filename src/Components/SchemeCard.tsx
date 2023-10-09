import CardHeader from "./CardHeader"
import FormsWrapped from "./FormsWrapped";
import ListCardBase from "./ListCardBase"

import schema from '../schema.json';
import uischema from '../uischema.json';
import { Button, Dialog, DialogContent, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { CloseRounded, DeleteForeverRounded, EditRounded, SaveRounded } from "@mui/icons-material";

const SchemeCard = (props: {
  closeSelf: () => void,
  current: { id: string, name: string, descr: string, scheme: string, ui_scheme: string }
}) => {

  const [templateSettingsOpen, setTemplateSettingsOpen] = useState(false)
  const [data, setData] = useState<any>({});

  return (
    <ListCardBase>
      <CardHeader
        openSettings={() => setTemplateSettingsOpen(true)}
        closeSelf={props.closeSelf}
        path={[{ url: "", name: "Šablony" }]}
        current={props.current.name}
        descr={props.current.descr}
        settingsButtonText="Nastavení šablony"
      />
      <Paper variant="outlined" sx={{ mt: 3, p: 3, pt: 2 }}>
        <FormsWrapped data={data} setData={setData} schema={props.current.scheme} uischema={props.current.ui_scheme} />
      </Paper>
      <Dialog fullWidth open={templateSettingsOpen} onClose={() => setTemplateSettingsOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Nastavení šablony</Typography>
          <TextField
            margin="dense"
            id="name"
            label="Název"
            fullWidth
            variant="filled"
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="filled"
            multiline
            rows="5"
            sx={{ mb: 2 }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <Button startIcon={<EditRounded/>}>Editovat šablonu</Button>
              <Button color="error" startIcon={<DeleteForeverRounded/>}>Smazat</Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => setTemplateSettingsOpen(false)}>Zrušit</Button>
              <Button startIcon={<SaveRounded/>} variant='contained' onClick={() => setTemplateSettingsOpen(false)}>Uložit</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  )
};

export default SchemeCard;

