import React, { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';

import { axiosInstance } from '../../../axiosInstance';
import DailyReportTable from './DailyReportTable';

function exportExcell(columnOrder, columnTitles, data, totalRow, file_name) {
    const dataWithoutTableData = data.map(({ tableData, id, ...item }) => item);
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(dataWithoutTableData, {
        header: columnOrder,
    });
    columnTitles.forEach((title, index) => {
        const cellAddress = utils.encode_cell({ r: 0, c: index });
        worksheet[cellAddress].v = title;
    });

    const totalRowIndex = data.length + 1;
    utils.sheet_add_json(worksheet, [totalRow], {
        header: ['label', 'total'],
        skipHeader: true,
        origin: totalRowIndex,
    });
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    writeFile(workbook, file_name);
}


const DailyReport = (props) => {
    const [dateBy, setDateBy] = useState({
        date: '',
        status: 'confirmed',
        sales_ref: '',
        distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
    });
    const [categoryBy, setCategoryBy] = useState({
        category: '-1',
        date_from: '',
        date_to: '',
        status: 'confirmed',
        sales_ref: '',
        distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
    });
    const [productBy, setProductBy] = useState({
        product: '-1',
        date_from: '',
        date_to: '',
        status: 'confirmed',
        sales_ref: '',
        distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
    });
    const [loading, setLoading] = useState(false);
    const [dateByData, setDateByData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [categoryByData, setCategoryByData] = useState([]);
    const [productByData, setProdctByData] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [salesrefs, setSalesrefs] = useState([]);

    useEffect(() => {
        if (props.user.is_manager) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/manager/${props.user.id}`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setDistributors(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });


        }
        if (props.user.is_company) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setDistributors(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });


        }
        if (props.user.is_excecutive) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/executive/${props.user.id}`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setSalesrefs(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (props.user.is_distributor) {
            axiosInstance.get(`/distributor/salesrefs/${props.user_details.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
                .then((res) => {
                    setSalesrefs(res.data);
                }).catch((err) => {
                    console.log(err);
                });
        }

        setLoading(true);
        axiosInstance
            .get(`/category/all/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                setCategories(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });

        setLoading(true);
        axiosInstance
            .get(`/distributor/salesref/inventory/items/${props.inventory}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                console.log('ite', res.data);
                setProducts(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    const handleDistributor = (e) => {
        setDateBy({
            ...dateBy,
            distributor: e.target.value,
        });
        setDateByData([]);
        axiosInstance.get(`/distributor/salesrefs/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {
                setSalesrefs(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };
    const handleDateByFilter = (e) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance
            .post(`/reports/daily-report/get/`, dateBy, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                setDateByData(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    const exportByDate = (e) => {
        e.preventDefault();
        const columnOrder = ['code', 'date', 'total'];
        const columnTitles = ['Invoice', 'Date', 'Value'];

        const file_name = 'salesreport_by_date.xlsx';
        const totalValue = dateByData.reduce((sum, item) => sum + item.total, 0);

        const totalRow = {
            label: 'Total',
            total: totalValue,
        };

        exportExcell(columnOrder, columnTitles, dateByData, totalRow, file_name);
    };

    const handleDistributorCategory = (e) => {
        setCategoryBy({
            ...categoryBy,
            distributor: e.target.value,
        });
        setCategoryByData([]);
    };
    const handleCategoryByFilter = (e) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance
            .post(`/reports/salesdetails/category/`, categoryBy, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                setCategoryByData(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    const exportByCategory = (e) => {
        e.preventDefault();
        const columnOrder = ['date', 'category', 'qty', 'extended_price'];
        const columnTitles = ['Date', 'Category', 'Qty', 'Value'];

        const file_name = 'salesreport_by_category.xlsx';
        const totalValue = categoryByData.reduce(
            (sum, item) => sum + item.extended_price,
            0
        );

        const totalRow = {
            label: 'Total',
            total: totalValue,
        };

        exportExcell(
            columnOrder,
            columnTitles,
            categoryByData,
            totalRow,
            file_name
        );
    };
    const handleDistributorProduct = (e) => {
        setProductBy({
            ...productBy,
            distributor: e.target.value,
        });
        setProdctByData([]);
        setLoading(true);

        axiosInstance
            .get(`distributor/by/others/${e.target.value}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                setProducts(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });


    };
    const handleProductByFilter = (e) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance
            .post(`/reports/salesdetails/product/`, productBy, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setLoading(false);
                setProdctByData(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };
    return (
        <div className="page">
            <div className="page__title">
                <p>Sales report</p>
            </div>
            <div className="page__pcont">
                <div className="page__pcont__row ">
                    <div className="page__pcont__row__col">
                        <p>Filter by Date Range</p>
                    </div>
                </div>
                <div className="form">
                    <div className="form__row">
                        {props.user.is_manager ||
                            props.user.is_company ||
                            props.user.is_excecutive ? (
                            <div className="form__row__col">
                                <div className="form__row__col__label">Distributor</div>
                                <div className="form__row__col__input">
                                    <select
                                        name=""
                                        id=""
                                        defaultValue={'1'}
                                        onChange={(e) => handleDistributor(e)}
                                    >
                                        <option value="">Select distributor</option>
                                        {distributors.map((item, i) => (
                                            <option value={item.id} key={i}>
                                                {item.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="form__row__col">
                            <div className="form__row__col__label">Date</div>
                            <div className="form__row__col__input">
                                <input
                                    type="date"
                                    onChange={(e) =>
                                        setDateBy({ ...dateBy, date_to: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {
                            !props.user.is_salesref ? (
                                <div className="form__row__col">
                                    <div className="form__row__col__label">Sales ref</div>
                                    <div className="form__row__col__input">
                                        <select name="" id="" onChange={(e) =>
                                            setDateBy({ ...dateBy, sales_ref: e.target.value })}>

                                            <option value="">Select sales rep</option>

                                            {
                                                salesrefs.map((item, i) => (<option value={item.salesref_id} key={i}>{item.full_name}</option>))
                                            }

                                        </select>
                                    </div>
                                </div>
                            ) : ''
                        }
                        <div
                            className="form__row__col dontdisp"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <button
                                className="btnEdit"
                                onClick={(e) => handleDateByFilter(e)}
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="page__pcont__row">
                    <div className="page__pcont__row__col">
                        <div className="dataTable">
                            <DailyReportTable data={dateByData} loading={loading} />
                        </div>
                    </div>
                </div>
                <div className="page__pcont__row">
                    <div className="page__pcont__row__col">
                        <button className="btnSave" onClick={(e) => exportByDate(e)}>
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailyReport