import {useState} from 'react'

export const useMix = (data) => {
    const [sstate, setState] = useState(data);

    const onlyNumber = (evt) => {
        evt = (evt) ? evt : window.event;
        let num = evt.target.value.toString() + evt.key.toString();

        if (!/^[0-9]*\.?[0-9]*$/.test(num)) {
            evt.preventDefault();
        }
    }

    function MyHtml(html) {
        return {__html: html};
    }

    const changeInpIntg = (event) => {
        event.persist();

        if (event.target.value === '') {
            setState(prev => ({...prev, ...{[event.target.name]: 0}}));
            return
        }

        setState(
            prev => ({
                ...prev,
                ...{
                    [event.target.name]: parseInt(event.target.value)
                }
            })
        )
    };

    const changeInp = (event) => {
        event.persist();

        if (event.target.name === 'landingUrl') {
            if (event.which == 13 || event.keyCode == 13) {
                e.preventDefault();
            };

            setState(
                prev => ({
                    ...prev,
                    ...{
                        [event.target.name]: event.target.value.replace("\n", "")
                    }
                })
            )

            return
        }

        setState(
            prev => ({
                ...prev,
                ...{
                    [event.target.name]: event.target.value
                }
            })
        )
    };

    const setMyState = (name, val) => {
        setState({
            ...sstate,
            [name]: val
        })
    }

    return {changeInpIntg, changeInp, onlyNumber, MyHtml, sstate, setMyState}
}

