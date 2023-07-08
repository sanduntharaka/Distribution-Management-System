import React, { useState } from 'react';
import CreatePsa from './CreatePsa';

const PsaTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
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
          PSA
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? <CreatePsa user={user} /> : ''}
      </div>
    </div>
  );
};

export default PsaTab;
