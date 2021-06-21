import React from "react";
import PropTypes from 'prop-types';

const Table = ({data, sortRow}) => {

    const editDate = (val) => {
        const date = val.split('T')[0].split('-')

        return date[2] + '-' + date[1] + '-' + date[0]
    }

    return (
        <table>
            <thead>
                <tr>
                    {Object.keys(data[0]).map((el, index) => el === 'ctr'
                        ? <th key={index}>ctr %</th>
                        : el === 'date'
                            ? <th key={index}>
                                <div
                                    style={{cursor: 'pointer'}}
                                    className={'th-wrapper'}
                                    onClick={() => sortRow('dateParse')}>
                                    Дата <i className="material-icons Tiny">import_export</i>
                                </div>
                            </th>
                            : el === 'dateParse' ? null : <th key={index}>{el}</th>)}
                </tr>
            </thead>
            <tbody>
            {data.map((el, index) =>
                    <tr key={index}>{Object.keys(el).map((elem, ind) =>
                        elem === 'dateParse' ? null : <td key={ind}>{elem === 'date' ? editDate(el[elem]) : elem === "Частота" ? Number(el[elem]).toFixed(2) : el[elem]}</td>
                    )}
                    </tr>
                )}
            </tbody>
        </table>
    )
}

Table.propTypes = {
    data: PropTypes.array,
    sortRow: PropTypes.func,
}

export default Table;