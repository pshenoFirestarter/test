import {useState, useCallback, useEffect} from 'react';

const strogeName = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null),
        [userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(id);

        localStorage.setItem(strogeName, JSON.stringify({
            userId: id, token: jwtToken
        }))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(strogeName);

    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(strogeName));

        if (data && data.token) {
            login(data.token, data.userId)
        }
    }, [login]);

    return {login, logout, token, userId}
};