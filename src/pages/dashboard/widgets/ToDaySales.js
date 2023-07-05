import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

const ToDaySales = (props) => {
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Today</h4>
          </div>
        </div>
        <div className="wcontainer__row__col icon">
          {props.data.status ? (
            <TbTriangleFilled className="up" />
          ) : (
            <TbTriangleInvertedFilled className="down" />
          )}
        </div>
      </div>
      <div className="wcontainer__row mt details">
        <div className="wcontainer__row__col">Invoice Count</div>
        <div className="wcontainer__row__col">{props.data.count}</div>
      </div>
      <div className="wcontainer__row details">
        <div className="wcontainer__row__col">Total Sale</div>
        <div className="wcontainer__row__col">Rs {props.data.total}/-</div>
      </div>
      <div className="wcontainer__row details">
        <div className="wcontainer__row__col">Total Discount</div>
        <div className="wcontainer__row__col">Rs {props.data.discount}/-</div>
      </div>
    </div>
  );
};

export default ToDaySales;