import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import CreateReturn from './CreateReturn';
import AllReturns from './AllReturns';
const ReturnTab = () => {
  const [inventory, setInventory] = useState();
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (i) => {
    setSelected(i);
  };

  useEffect(() => {
    //
    setIsLoading(true);
    axiosInstance
      .get(
        `/distributor/salesref/inventory/${
          JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setInventory(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="tab">
      <div className="tab_contaner">
        <div
          className={`item ${selected === 0 ? 'selected' : ''}`}
          onClick={() => handleSelect(0)}
        >
          Add returns
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          All returns
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 && isLoading === false && inventory !== undefined ? (
          <CreateReturn inventory={inventory} />
        ) : selected === 1 && isLoading === false && inventory !== undefined ? (
          <AllReturns inventory={inventory} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
export default ReturnTab;
