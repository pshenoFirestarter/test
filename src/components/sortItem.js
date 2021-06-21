import React from "react";
import PropTypes from 'prop-types';


const Sort = ({el, setActive, active}) => {
    const submit = () => {
        setActive(el.name);
    };

    return (
        <span onClick={submit} className={`sort ${active === el.sort ? 'active' : ''}`}>{el.name} <i className="material-icons Small">import_export</i></span>
    )
};

Sort.propTypes = {
    setActive: PropTypes.func,
    el: PropTypes.object,
    active: PropTypes.string,
};

export default Sort;