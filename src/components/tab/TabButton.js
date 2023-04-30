import React, { useState } from 'react';
export const TabButton = (props) => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
    console.log(index);
  };
  return (
    <button
      className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
      onClick={() => toggleTab(1)}
    >
      {props.name}
    </button>
  );
};
