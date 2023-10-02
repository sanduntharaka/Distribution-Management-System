import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area
} from "recharts";



const TargetChart = ({ data }) => {
    return (
        <div className='targetChart'>
            <ResponsiveContainer >
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <Tooltip />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="target" fill="#8884d8" />
                    <Bar dataKey="achieved" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TargetChart