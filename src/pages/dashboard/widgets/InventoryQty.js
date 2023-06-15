import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
const InventoryQty = (props) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (props.user.is_distributor) {
      axiosInstance
        .get(`/dashboard/get/lowqty/by/distributor/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setItems(res.data);
        });
    }
    if (props.user.is_salesref) {
      axiosInstance
        .get(`/dashboard/get/lowqty/by/salesref/${props.info.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setItems(res.data);
        });
    }
  }, []);

  return (
    <div className="wid-details">
      <div className="title">
        <h4>Low Qty Products</h4>
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

export default InventoryQty;
