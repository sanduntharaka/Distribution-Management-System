import React, { useEffect, useState } from 'react';
import AddInventory from './AddInventory';
import ViewInventory from './ViewInventory';
import DistributorInventory from './DistributorInventory';
import AddDistributorInventory from './AddDistributorInventory';
import SalesRefInventory from './SalesRefInventory';
import { axiosInstance } from '../../axiosInstance';

const InventoryTabs = () => {
  const [selected, setSelected] = useState(0);
  const handleSelect = (i) => {
    setSelected(i);
  };
  const [inventory, setInventory] = useState();
  useEffect(() => {
    // if (JSON.parse(sessionStorage.getItem('user')).is_salesref === true) {
    //   axiosInstance
    //     .get(
    //       `/salesref/get/${
    //         JSON.parse(sessionStorage.getItem('user_details')).id
    //       }`,
    //       {
    //         headers: {
    //           Authorization:
    //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       setInventory(res.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
    if (JSON.parse(sessionStorage.getItem('user')).is_distributor === true) {
      axiosInstance
        .get(
          `/distributor/get/${
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
          console.log('dis:', res.data);
          setInventory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <div className="tab">
      <div className="tab_contaner">
        <div
          className={`item ${selected === 0 ? 'selected' : ''}`}
          onClick={() => handleSelect(0)}
        >
          Add inventory
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          View inventory
        </div>
        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Add Distributor inventory
        </div>
        <div
          className={`item ${selected === 3 ? 'selected' : ''}`}
          onClick={() => handleSelect(3)}
        >
          Distributor inventory
        </div>
        {/* <div
          className={`item ${selected === 4 ? 'selected' : ''}`}
          onClick={() => handleSelect(4)}
        >
          Sales ref inventory
        </div> */}
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <AddInventory />
        ) : selected === 1 ? (
          <ViewInventory />
        ) : selected === 2 ? (
          <AddDistributorInventory inventory={inventory} />
        ) : selected === 3 ? (
          <DistributorInventory inventory={inventory} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

// : selected === 4 ? (
//   <SalesRefInventory inventory={inventory} />
// )

export default InventoryTabs;
