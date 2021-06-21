import React, {useEffect, useRef} from "react";
import PropTypes from 'prop-types';


const Select =  ({list, pix, count}) => {
    let instance  = ''

    const chHandler = (event) => {
    }

    const myMulti = () => {
        const elem = document.getElementById('select' + count);
        window.M.FormSelect.init(elem, {});
        instance = window.M.FormSelect.getInstance(elem)
    }



    useEffect(() => {
        myMulti()
    }, [])

    return (
        <>
            <div className="input-field col s12 myselect">
                <select id={'select' + count} onChange={chHandler} defaultValue={pix ? pix : ''}>
                    {list ? list.map((el, index) => <option key={index} value={el === pix ? pix : el}>{el === pix ? pix : el}</option>) : ''}
                </select>
                <label>Event</label>
            </div>
        </>
    )
}

Select.propTypes = {
    list: PropTypes.array,
    pix: PropTypes.string,
    count: PropTypes.number
}

export default Select;