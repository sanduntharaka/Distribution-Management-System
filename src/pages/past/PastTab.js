import React, { useState } from 'react';
import AddInvoice from './AddInvoice';
import AddCheque from './AddCheque';

const PastTab = () => {
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
          Market credit
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          Add Cheque
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? <AddInvoice /> : selected === 1 ? <AddCheque /> : ''}
      </div>
    </div>
  );
};
export default PastTab;
