import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';

import FocReportTable from './FocReportTable';

function exportExcell(
  columnOrder,
  columnTitles,
  data,
  totalRow,
  file_name,
  addtional
) {
  const workbook = utils.book_new();
  const worksheet = utils.aoa_to_sheet([]);

  const territoryRow = ['Terriotory', addtional.territory];
  const distributorRow = ['Distributor', addtional.distributor];

  utils.sheet_add_aoa(worksheet, [territoryRow, distributorRow]);
  const tableHeaders = columnTitles;
  utils.sheet_add_aoa(worksheet, [tableHeaders], { origin: 4 });
  const tableData = data.map((detail) => [
    detail.date,
    detail.invoice_number,
    detail.item_code,
    detail.category,
    detail.dealer_name,
    detail.dealer_address,
    detail.dealer_contact_number,
    detail.qty,
    detail.addtional_foc_qty,
    detail.value,
  ]);
  utils.sheet_add_aoa(worksheet, tableData, { origin: 5 });
  const totalRowIndex = data.length + 5;
  utils.sheet_add_json(worksheet, [totalRow], {
    header: ['label', 'total'],
    skipHeader: true,
    origin: totalRowIndex,
  });
  utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
  writeFile(workbook, file_name);
}

const AddtionalFocReport = (props) => {
  const [filterData, setFilterData] = useState({
    date_from: '',
    date_to: '',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });
  const [showdata, setShowdata] = useState({
    territory: '',
    distributor: '',
    manager: '',
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [distributors, setDistributors] = useState([]);
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

          setDistributors(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handleDistributorDateBy = (e) => {
    setFilterData({
      ...filterData,
      distributor: e.target.value,
    });
    setData([]);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(`/reports/addtionalfocreport/get/`, filterData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setData(res.data);
        setShowdata({
          ...showdata,
          territory: res.data.territory,
          distributor: res.data.distributor,
          manager: res.data.manager,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const handleExport = (e) => {
    e.preventDefault();
    // Calculate the total quantity
    const columnOrder = [
      'date',
      'invoice_number',
      'item_code',
      'category',
      'dealer_name',
      'dealer_address',
      'dealer_contact_number',
      'qty',
      'addtional_foc_qty',
      'value',
    ];

    const columnTitles = [
      'Date',
      'Invoice number',
      'Item code',
      'Category',
      'Dealer name',
      'Dealer address',
      'Dealer contact number',
      'Qty',
      'Additional foc',
      'Value',
    ];
    const file_name = 'addtional_foc_by_date.xlsx';
    const totalValue = data.details.reduce(
      (sum, item) => sum + item.addtional_foc_qty,
      0
    );

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(
      columnOrder,
      columnTitles,
      data.details,
      totalRow,
      file_name,
      showdata
    );
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Addtional Foc report</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by</p>
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
                    onChange={(e) => handleDistributorDateBy(e)}
                  >
                    <option value="">Select Distributor</option>
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
              <div className="form__row__col__label">Date From</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setFilterData({ ...filterData, date_from: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form__row__col">
              <div className="form__row__col__label">Date To</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setFilterData({ ...filterData, date_to: e.target.value })
                  }
                />
              </div>
            </div>
            <div
              className="form__row__col dontdisp"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <button className="btnEdit" onClick={(e) => handleFilter(e)}>
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <FocReportTable data={data.details} loading={loading} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <button className="btnSave" onClick={(e) => handleExport(e)}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddtionalFocReport;
