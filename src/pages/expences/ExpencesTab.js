import React, { useEffect, useState } from 'react';

import { axiosInstance } from '../../axiosInstance';

import CreateExpences from './CreateExpences';
import ViewExpences from './ViewExpences';

const ExpencesTab = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [inventory, setInventory] = useState();
    const [loading, setIsLoading] = useState(false);
    useEffect(() => {
        if (user.is_salesref === true) {
            setIsLoading(true);
            axiosInstance
                .get(
                    `/distributor/salesref/inventory/bysalesref/${JSON.parse(sessionStorage.getItem('user_details')).id
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
                    `/distributor/get/${JSON.parse(sessionStorage.getItem('user_details')).id
                    }`,
                    {
                        headers: {
                            Authorization:
                                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                        },
                    }
                )
                .then((res) => {
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
        0
    );
    const handleSelect = (i) => {
        setSelected(i);
    };

    return (
        <div className="tab">
            <div className="tab_contaner">

                {user.is_distributor ? (
                    <div
                        className={`item ${selected === 0 ? 'selected' : ''}`}
                        onClick={() => handleSelect(0)}
                    >
                        Add Expences
                    </div>
                ) : (
                    ''
                )}


                {user.is_distributor ? (
                    <>
                        <div
                            className={`item ${selected === 1 ? 'selected' : ''}`}
                            onClick={() => handleSelect(1)}
                        >
                            View Expences
                        </div>

                    </>
                ) : ""}
            </div>
            <div className="tab_page">
                {loading === false && selected === 0 && inventory !== undefined ? (
                    <CreateExpences inventory={inventory} />
                ) : loading === false && selected === 1 && inventory !== undefined ? (
                    <ViewExpences inventory={inventory} />
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

export default ExpencesTab;
