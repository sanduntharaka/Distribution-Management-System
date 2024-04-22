import React from 'react';
import { formatNumberPrice } from '../../../var/NumberFormats';

const YesterDay = (props) => {
  return (
    <div className="wcontainer ">
      <div className="wcontainer__row ">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Yesterday Sales</h4>
          </div>
        </div>
      </div>
      <div className="wcontainer__row mt details">
        <div className="wcontainer__row__col">Invoice Count</div>
        <div className="wcontainer__row__col">{props.data.count}</div>
      </div>
      <div className="wcontainer__row details">
        <div className="wcontainer__row__col">Total Sale</div>
        <div className="wcontainer__row__col">
          Rs {formatNumberPrice(props.data.total_sales)}/-
        </div>
      </div>
    </div>
  );
};

export default YesterDay;
