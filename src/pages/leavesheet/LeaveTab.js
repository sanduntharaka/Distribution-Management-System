import React, { useState } from 'react';
import CreateLeave from './CreateLeave';
import CreatedLeaves from './CreatedLeaves';

const LeaveTab = () => {
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
          Create Leave
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          All Leaves
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <CreateLeave />
        ) : selected === 1 ? (
          <CreatedLeaves />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default LeaveTab;
