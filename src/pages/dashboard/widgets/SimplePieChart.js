import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
const SimplePieChart = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axiosInstance
      .get('/dashboard/get/lowqty/company/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItems(res.data);
      });
  }, []);

  return (
    <div className="wid-details">
      <div className="title">
        <h2>Low Qty Products</h2>
      </div>
      <div className="content">
        {items.map((item, i) => (
          <div className={`item ${i % 2 !== 0 ? 'none' : ''}`} key={i}>
            <p>{item.id}</p>
            <p>{item.item_code}</p>
            <p>{item.qty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimplePieChart;
