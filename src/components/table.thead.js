import React, {useState} from "react";
import PropTypes from 'prop-types';
import SortItem from './sortItem'

const TableThead = ({paginator, sortingBy, currentSort, sortThead}) => {
    let sortDir = currentSort.dir;

    const [active, setActive] = useState('');

    const setA = async (name) => {
        sortDir = sortDir === ' asc' ? ' desc' : ' asc';
        setActive(null);
        sortThead.map((el, index, arr) => {
            if (el.name === name ) {
                return setActive(arr[index])
            }
        });

        let sort = (sortThead.find(item => item.name === name)).sort;
        sortingBy({name:sort, dir: sortDir});
        paginator(sort + sortDir);
    };

    return (
        <thead>
            <tr>
                {sortThead.map((el, index) => <th key={index}><SortItem el={el} setActive={setA} active={active.sort} /></th>)}
                <th> </th>
            </tr>
        </thead>
    )
};

TableThead.propTypes = {
    currentSort: PropTypes.object,
    paginator: PropTypes.func,
    sortingBy: PropTypes.func,
    sortThead: PropTypes.array,
};

export default TableThead;