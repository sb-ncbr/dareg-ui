import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, LinearProgress, Typography } from "@mui/material";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import { setCredentials } from "../Reducers/authSlice";
import { User } from "oidc-client-ts";
import einfraLogo from '../Static/e-INFRA_logo_RGB_lilek.png';
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect } from "react";


type UserStateCallback = {
    auth_request_id: string
}
const OIDCCallback = () => {
    const auth = useAuth();

    let redirect = "/";

    if (auth.isAuthenticated && !auth.isLoading) {
        setCredentials({ user: auth.user || {} as User, token: auth.user?.access_token || ""})
        const authRequestId = (auth.user?.state as UserStateCallback).auth_request_id;
        const o = JSON.parse(localStorage.getItem(authRequestId) as string)
        if (authRequestId && o) { 
            redirect = o.redirect;
            localStorage.removeItem(authRequestId)
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // Perform any action after 1 second if needed
        }, 1000);

        return () => clearTimeout(timer);
    }, [auth]);

    return (
        !auth.isLoading && auth.isAuthenticated && !auth.activeNavigator ? (
                <Navigate to={redirect} />
            ) : (
                <><Button sx={{ mt: 1 }} size="large" variant="outlined" fullWidth disabled>
                    Signin in progress...
                </Button><LinearProgress />
                </>
            )
    )
}

export default OIDCCallback;
