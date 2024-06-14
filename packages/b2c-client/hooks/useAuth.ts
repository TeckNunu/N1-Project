import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export const useAuth = (site: string) => {
    const [auth, setAuth] = useState();

    useEffect(() => {
        const authCookies = Cookies.get(
            site === 'client' ? 'accessTokenClient' : 'accessToken'
        );
        if (authCookies) {
            setAuth(JSON.parse(authCookies));
        }
    }, [site]);

    return auth;
};
