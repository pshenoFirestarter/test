import {useCallback, useState} from 'react';
import {useMessage} from "./msg.hook";

export const useHttp = (preloader) => {
    const [err, setErr] = useState(null);
    const message = useMessage();

    const req = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        preloader(true);

        try {
            if(body) {
                body = JSON.stringify(body);
                headers['content-type'] = 'application/json';
            }

            const res = await fetch(url, {method, body, headers});

            if (res.status === 401) {

                message('No authorization')
                localStorage.clear()
                return
            }

            let data = await res.json();

            preloader(false);
            return data
        } catch (e) {
            preloader(false);
            setErr(e.message);
            throw new Error(e.message);
        }
    }, []);

    const clear = useCallback(() => {
        setErr(null);
    }, []);

    return {req, err, clear}
}
