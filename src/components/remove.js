import React from "react";
import PropTypes from 'prop-types';

const Remove = ({name, removeEl}) => {
    const submit = async (event) => {
        event.preventDefault();
        removeEl(true);
    };

    return (
        <div className={'modal-wrapper'}>
            <form id="modal1" onSubmit={submit} className="modal open modal-remove">
                <div className="modal-content wrapper-fields">
                    <div>
                        <h3>Are you sure want to delete?</h3>
                        <h5><i>{name}</i></h5>
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="modal-footer btn-wrapper">
                        <button type={"button"} onClick={() => removeEl(false)} className="waves-effect waves-light red btn-small btn">CANCEL</button>
                        <button type={"submit"} className="waves-effect waves-light btn-small black btn">REMOVE</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

Remove.propTypes = {
    name: PropTypes.string,
    removeEl: PropTypes.func,
};

export default Remove;