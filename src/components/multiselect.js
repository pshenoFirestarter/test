import React, {useEffect, useRef} from "react";
import PropTypes from 'prop-types';

const Multi = ({sources, sourceHandler}) => {
    const arr = sources;
    let instance  = ''

    const getSelectValues = (select) => {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    const chHandler = (event) => {
        let val = getSelectValues(document.querySelector('select'))

        sourceHandler(val)
    }

    const myMulti = () => {
        const elem = document.querySelector('select');
        window.M.FormSelect.init(elem, {});
        instance = window.M.FormSelect.getInstance(elem)
    }



    useEffect(() => {
        myMulti()
    }, [sources])

    return (
        <>
            <div className="input-field col s12 myselect">
                <select onChange={chHandler}>
                    {arr.map((el, index) => <option key={index} value={el.id}>{el.name} </option>)}
                </select>
                <label>Выбрать кампанию</label>
            </div>
        </>
    )
}

Multi.propTypes = {
    sources: PropTypes.array,
    sourceHandler: PropTypes.func,
}

export default Multi