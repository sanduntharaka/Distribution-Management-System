import React, { useEffect, useState } from 'react';
import AddInventory from './AddInventory';
import ViewInventory from './ViewInventory';
import DistributorInventory from './DistributorInventory';
import AddDistributorInventory from './AddDistributorInventory';
import SalesRefInventory from './SalesRefInventory';
import { axiosInstance } from '../../axiosInstance';
import Category from './Category';

const InventoryTabs = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [inventory, setInventory] = useState();
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user.is_salesref === true) {
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
          console.log('inv', res.data);
          setIsLoading(false);
          setInventory(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
    if (user.is_distributor === true) {
      setIsLoading(true);
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
          setIsLoading(false);
          setInventory(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, []);

  const [selected, setSelected] = useState(
    user.is_companyStaff || user.is_superuser
      ? 0
      : user.is_distributor
      ? 3
      : user.is_salesref
      ? 4
      : 0
  );
  const handleSelect = (i) => {
    setSelected(i);
  };

  return (
    <div className="tab">
      <div className="tab_contaner">
        {user.is_companyStaff || user.is_superuser ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            Category
          </div>
        ) : (
          ''
        )}
        {user.is_companyStaff || user.is_superuser ? (
          <div
            className={`item ${selected === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >
            Add inventory
          </div>
        ) : (
          ''
        )}
        {user.is_companyStaff || user.is_superuser ? (
          <div
            className={`item ${selected === 2 ? 'selected' : ''}`}
            onClick={() => handleSelect(2)}
          >
            View inventory
          </div>
        ) : (
          ''
        )}
        {user.is_distributor ? (
          <div
            className={`item ${selected === 3 ? 'selected' : ''}`}
            onClick={() => handleSelect(3)}
          >
            Add Distributor inventory
          </div>
        ) : (
          ''
        )}
        {user.is_distributor || user.is_salesref ? (
          <div
            className={`item ${selected === 4 ? 'selected' : ''}`}
            onClick={() => handleSelect(4)}
          >
            Distributor inventory
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <Category />
        ) : selected === 1 ? (
          <AddInventory />
        ) : selected === 2 ? (
          <ViewInventory />
        ) : loading === false && selected === 3 && inventory !== undefined ? (
          <AddDistributorInventory inventory={inventory} />
        ) : loading === false && selected === 4 && inventory !== undefined ? (
          <DistributorInventory inventory={inventory} user={user} />
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
