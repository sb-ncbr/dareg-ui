import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

type UserStateCallback = {
    auth_request_id: string
}
const OIDCCallback = () => {
    const auth = useAuth();

    let redirect = "/";

    if (auth.isAuthenticated && !auth.isLoading) {
        const authRequestId = (auth.user?.state as UserStateCallback).auth_request_id;
        const o = JSON.parse(localStorage.getItem(authRequestId) as string)
        if (authRequestId && o) { 
            redirect = o.redirect;
            localStorage.removeItem(authRequestId)
        }
    };

    return (
        !auth.isLoading && auth.isAuthenticated ? (
                <Navigate to={redirect} />
            ) :
        <div>
            error while trying to authenticate.
        </div>
    )
}

export default OIDCCallback;
