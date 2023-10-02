import React, { useEffect, useState } from 'react'
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
import { axiosInstance } from '../../../axiosInstance';




const TargetChart = (props) => {

    return (

        <ResponsiveContainer>
            <BarChart
                width={500}
                height={400}
                data={props.data}
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



                <Bar dataKey="target" fill="#8884d8" />
                <Bar dataKey="achieved" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>

    )
}

export default TargetChart