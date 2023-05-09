import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

const InventoryStatus = (props) => {
  const [data, setData] = useState({
    count: 0,
    total: 0,
    discount: 0,
    status: false,
  });
  useEffect(() => {
    let date = props.date;
    axiosInstance
      .post(
        '/dashboard/today/inventory/notzero/company/',
        {
          date: date,
        },
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setData({
          ...data,
          count: res.data.count,
        });
      });
  }, []);
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Total Items</h4>
          </div>
        </div>
      </div>
      <div className="wcontainer__row mt">
        <div className="wcontainer__row__col">{data.count}</div>
      </div>
    </div>
  );
};

export default InventoryStatus;
