import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

const ToDaySales = (props) => {
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
        '/dashboard/today/sales/invoices/company/',
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
          total: res.data.total,
          discount: res.data.discount,
          status: res.data.status,
        });
      });
  }, []);

  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Today</h4>
          </div>
        </div>
        <div className="wcontainer__row__col icon">
          {data.status ? (
            <TbTriangleFilled className="up" />
          ) : (
            <TbTriangleInvertedFilled className="down" />
          )}
        </div>
      </div>
      <div className="wcontainer__row mt">
        <div className="wcontainer__row__col">Invoice Count</div>
        <div className="wcontainer__row__col">{data.count}</div>
      </div>
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">Total Sale</div>
        <div className="wcontainer__row__col">Rs {data.total}/-</div>
      </div>
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">Total Discount</div>
        <div className="wcontainer__row__col">Rs {data.discount}/-</div>
      </div>
    </div>
  );
};

export default ToDaySales;
