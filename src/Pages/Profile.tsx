import { Button, Table, TableCell, TableRow, Grid, Typography, Stack, Divider, Box, Grid2 } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import ceitecLogo from "../Static/ceitec_logo.png"
import useAvatar from '../Utils/useAvatar';
import { User } from 'oidc-client-ts';
import ContentHeader from '../Components/ContentHeader';
import ContentCard from '../Components/ContentCard';
import SettingsMenu from '../Components/SettingsMenu';
import { useGetProfileQuery, useUpdateProfileMutation } from '../Services/profile';
import { useEffect } from 'react';

type AdvancedUser = User & {organization: string}
const Profile = () => {
    const auth = useAuth();
    const { avatarComponent} = useAvatar({size: 220});
    const { t, i18n } = useTranslation()
    const profile = useGetProfileQuery(1)
    const data = profile.data?.results[0]
    console.log(data)
    const [ updateProfile ] = useUpdateProfileMutation()
    useEffect(() => {
        i18n.changeLanguage(data?.default_lang)
    }, [profile.isSuccess])

    const langDict:{[key: string]: string} = {
        "en-US": "English",
        "cs-CZ": "čeština",
    }
    return(
        <>
        <ContentHeader title={"Profile"}>
        </ContentHeader>
        <ContentCard title={`${t('auth.welcome')} ${auth.user?.profile.given_name},`}>
            <Grid2 container spacing={1}>
                <Grid2 size={{xs: 12, sm: 4, md: 2}} sx={{margin: "0 auto"}}>
                    {avatarComponent}   
                </Grid2>
                <Grid2 size={{xs: 12, sm: 8, md: 10}}>
                    <Table>
                        <TableRow>
                            <TableCell>
                                {t('profile.name')}      
                            </TableCell>    
                            <TableCell>
                                {auth.user?.profile.name}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.organization')}      
                            </TableCell>    
                            <TableCell>
                                {(auth.user as AdvancedUser)?.organization || "Masaryk University"}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.email')}   
                            </TableCell>    
                            <TableCell>
                                {auth.user?.profile.email || "Not defined"}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.last_login')}   
                            </TableCell>    
                            <TableCell>
                                {new Date(data?.last_login || "").toLocaleString()}
                                
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.logged')}   
                            </TableCell>    
                            <TableCell>
                                <Stack direction="row" spacing={1} alignItems={"center"}>
                                    <Typography>{auth?.user?.profile.sub}</Typography>
                                    <img width="160px" style={{verticalAlign: "middle", marginRight: 10}} src={ceitecLogo} />
                                    <Button variant="outlined" color="error" onClick={() => auth.signoutRedirect()}>{t('auth.logout')}</Button>
                                </Stack>
                            </TableCell>
                        </TableRow>    
                    </Table>
                </Grid2>
            </Grid2>
        </ContentCard>
        {profile.isSuccess ?
            <ContentCard title='Settings'>
                <Box sx={{width: 300}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography>{t("Settings.language")}: </Typography>
                        <SettingsMenu
                            bttnText={langDict[i18n.language]}
                            options={langDict}
                            onClick={(lang: "en-US"|"cs-CZ") => {
                                let updatedProfile
                                const requestData = {
                                    ...data,
                                    default_lang: lang
                                }
                                updatedProfile = updateProfile(requestData)
                                updatedProfile?.then((response) => {
                                    i18n.changeLanguage(lang)
                                })
                            }}
                        />
                    </Stack>
                    <Divider sx={{ mt: 1, mb: 1 }}/>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography>{t("Settings.appearance")}: </Typography>
                        <SettingsMenu 
                            bttnText={t(`Settings.${profile.data.results[0].default_theme}`)} 
                            options={{system: t("Settings.system"), light: t("Settings.light"), dark: t("Settings.dark")}}
                            onClick={(theme: "light"|"dark"|"system") => {
                                let updatedProfile
                                const requestData = {
                                    ...data,
                                    default_theme: theme
                                }
                                updatedProfile = updateProfile(requestData)
                            }}
                        />
                    </Stack>
                </Box>
            </ContentCard>
            : <Typography>Loading...</Typography>
        }
        </>
    );
}

export default Profile