import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
// } from 'recharts';
// import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const MainChart = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (props.user.is_salesref) {
      axiosInstance
        .get(`/dashboard/get/allsales/salesref/months/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
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
          setData(res.data);
        });
    }
    if (props.user.is_excecutive) {
      axiosInstance
        .get(`/dashboard/get/allsales/executive/months/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setData(res.data);
        });
    }
    if (props.user.is_company) {
      axiosInstance
        .get(`/dashboard/get/allsales/company/months/`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
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
          setData(res.data);
        });
    }
  }, []);
  // const data = [
  //   {
  //     name: 'Page A',
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page B',
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     name: 'Page C',
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     name: 'Page D',
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     name: 'Page E',
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     name: 'Page F',
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     name: 'Page G',
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  // ];
  return (
    // <ResponsiveContainer width="100%" height="100%">
    //   <BarChart
    //     width={500}
    //     height={400}
    //     data={data}
    //     margin={{
    //       top: 10,
    //       right: 30,
    //       left: 0,
    //       bottom: 0,
    //     }}
    //   >
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="month" />
    //     <Tooltip />
    //     <Area
    //       type="monotone"
    //       dataKey="total"
    //       stackId="1"
    //       stroke="#8884d8"
    //       fill="#8884d8"
    //     />
    //   </BarChart>
    // </ResponsiveContainer>
    <ResponsiveContainer width="100%" height="90%" >
      <BarChart width={150} height={40} data={data} >
        <XAxis dataKey="month" />

        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MainChart;

