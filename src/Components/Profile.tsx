import { Avatar, Button, Table, TableCell, TableRow, Grid, Typography } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import ceitecLogo from "../ceitec_logo.png"
import useAvatar from '../Utils/useAvatar';
import { User } from 'oidc-client-ts';

type AdvancedUser = User & {organization: string}
const Profile = () => {
    const auth = useAuth();
    const { t } = useTranslation();
    const { avatarUrl} = useAvatar();

    return(
        <>
        <Typography variant="h4" sx={{mb:3}}>{t('auth.welcome')} {auth.user?.profile.given_name},</Typography>
        <Grid container spacing={2} alignItems={"center"}>
                <Grid item justifyContent="center" display={"flex"}>
                    <Avatar sx={{width:200,height:200}} variant={"circular"} src={avatarUrl+"?s=200"} alt="Profile picture, gravatar of the logged in user" />
                </Grid>
                <Grid item>
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
                                {t('profile.logged')}   
                            </TableCell>    
                            <TableCell>
                                <img width="160px" style={{verticalAlign: "middle", marginRight: 10}} src={ceitecLogo} />
                                <Button variant="outlined" color="error" onClick={() => auth.signoutRedirect()}>{t('auth.logout')}</Button>
                            </TableCell>
                        </TableRow>    
                    </Table>
                </Grid>
        </Grid>
        </>
    );
}

export default Profile