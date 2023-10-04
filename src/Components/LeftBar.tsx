import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { AccountCircleRounded, AssignmentIndRounded, BackupTableRounded, BiotechRounded, ExitToAppRounded, FolderCopyRounded, LogoutRounded, ScienceRounded, SettingsRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const LeftBar = (props: {section: string, setSection: (value: string) => void}) => {
  const LeftButton = styled(ListItemButton)(({}) => ({
    "&:hover": {
      fontWeight: 400,
    }
  }))

  const { t } = useTranslation()

  return (
    <Box padding={4} height="100vh" justifyContent="space-between" display="flex" flexDirection="column">
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton selected={props.section==="projects" ? true : false} onClick={() => props.setSection("projects")}>
            <ListItemIcon>
              <FolderCopyRounded />
            </ListItemIcon>
            <ListItemText primary={t('LeftBar.projects')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton selected={props.section==="templates" ? true : false} onClick={() => props.setSection("templates")}>
            <ListItemIcon>
              <BackupTableRounded />
            </ListItemIcon>
            <ListItemText primary={t('LeftBar.templates')} />
          </ListItemButton>
        </ListItem>
      </List>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton onClick={() => props.setSection("projects")}>
            <ListItemIcon>
              <ExitToAppRounded />
            </ListItemIcon>
            <ListItemText primary={t('LeftBar.logout')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton selected={props.section==="account" ? true : false} onClick={() => props.setSection("account")}>
            <ListItemIcon>
              <AssignmentIndRounded />
            </ListItemIcon>
            <ListItemText primary={t('LeftBar.account')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton selected={props.section==="settings" ? true : false} onClick={() => props.setSection("settings")}>
            <ListItemIcon>
              <SettingsRounded />
            </ListItemIcon>
            <ListItemText primary={t('LeftBar.settings')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default LeftBar;
