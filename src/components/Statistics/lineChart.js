import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import PropTypes from 'prop-types';

const Chart = ({data, stats})=> {
    const colors = ['#8884d8', '#82ca9d', '#166b36', '#ffc614', '#98f328', '#dec67a', '#969e8c', '#945748', '#8937a9', '#ff714e','#f575cc', '#b700ff','#f73100', '#2c00ff','#6d94f3','#f700a7'];



    return(
            <>
                <ResponsiveContainer width={'100%'} height={400}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 10, right: 30, left: 0, bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {stats.map((el, index) =>
                            el === 'date' || el === 'totalReach'
                            ? null
                            : <Line
                                key={index + 'chart'}
                                type="monotone"
                                dataKey={el}
                                stackId={index}
                                stroke={colors[index]}
                                fill={colors[index]}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </>
        )
}

Chart.propTypes = {
    data: PropTypes.array,
    stats: PropTypes.array
}

export default Chart