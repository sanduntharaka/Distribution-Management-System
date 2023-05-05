import React, { useState } from 'react';
import AssignSalesRef from './AssignSalesRef';
import ShowInvoices from './ShowInvoices';

const SalesTabs = () => {
  const [selected, setSelected] = useState(0);
  const handleSelect = (i) => {
    setSelected(i);
  };
  return (
    <div className="tab">
      <div className="tab_contaner">
        <div
          className={`item ${selected === 0 ? 'selected' : ''}`}
          onClick={() => handleSelect(0)}
        >
          Assign
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          View
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <AssignSalesRef />
        ) : selected === 1 ? (
          <ShowInvoices inventory={0} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default SalesTabs;
