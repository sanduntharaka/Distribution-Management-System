import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

const TotalReturns = (props) => {
  const [data, setData] = useState({
    count_return_good: 0,
    count_return_good_items: 0,
    count_deduct_good: 0,
    total_deduct_good: 0,
    count_deduct_good_items: 0,
  });
  useEffect(() => {
    let date = props.date;
    axiosInstance
      .post(
        '/dashboard/today/market-return/company/',
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
          count_return_good: res.data.count_return_good,
          count_return_good_items: res.data.count_return_good_items,
          count_deduct_good: res.data.count_deduct_good,
          count_return_good_items: res.data.total_deduct_good,
          count_deduct_good_items: res.data.count_deduct_good_items,
        });
      });
  }, []);
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Total Market Returns</h4>
          </div>
        </div>
      </div>
      <div className="wcontainer__row mt">
        <div className="wcontainer__row__col">
          <p>Goods</p>
          <p>{data.count_return_good_items}</p>
        </div>
        <div className="wcontainer__row__col">
          <p>Deducs</p>
          <p>Rs {data.count_return_good_items}/-</p>
        </div>
      </div>
    </div>
  );
};
export default TotalReturns;
