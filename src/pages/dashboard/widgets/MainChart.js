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
  const [data, setData] = useState([
  ]);
  const [revisedOrder, setRevisedOrder] = useState([]);
  useEffect(() => {
    const getRevisedOrderOfMonths = () => {
      const currentMonth = new Date().getMonth() + 1; // Adding 1 to make it 1-based
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const revisedOrder = [];
      for (let i = currentMonth - 1; i >= 0; i--) {
        revisedOrder.push(monthNames[i]);
      }

      for (let i = 11; i >= currentMonth; i--) {
        revisedOrder.push(monthNames[i]);
      }

      setRevisedOrder(revisedOrder);
    };

    getRevisedOrderOfMonths();
  }, []);

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
  const reorderedData = revisedOrder.map((month) => data.find((item) => item.month === month))
  const filteredArray = reorderedData.filter(item => item !== undefined).reverse();

  console.log(filteredArray);
  console.log(reorderedData)
  return (

    <ResponsiveContainer width="100%" height="90%" >
      <BarChart width={150} height={40} data={filteredArray} >
        <XAxis dataKey='month' />

        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MainChart;

