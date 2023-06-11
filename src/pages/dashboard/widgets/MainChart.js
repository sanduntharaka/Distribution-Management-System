import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MainChart = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('lgd', props.info);
    if (props.user.is_salesref) {
      axiosInstance
        .get(`/dashboard/get/allsales/salesref/months/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    }
    if (props.user.is_manager) {
      axiosInstance
        .get(`/dashboard/get/allsales/manager/months/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    }
    if (props.user.is_distributor) {
      axiosInstance
        .get(`/dashboard/get/allsales/distributor/months/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    }
  }, []);
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MainChart;
