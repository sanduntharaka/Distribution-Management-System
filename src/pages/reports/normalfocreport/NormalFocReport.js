import React, { useEffect, useState } from 'react';
import ByDateRangeTable from './ByDateRangeTable';
import { utils, writeFile } from 'xlsx';

import { axiosInstance } from '../../../axiosInstance';

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

  const territoryRow = ['Terriotory', addtional.terriotory];
  const distributorRow = ['Distributor', addtional.distributor];
  const managerRow = ['Manager', addtional.manager];

  utils.sheet_add_aoa(worksheet, [territoryRow, distributorRow, managerRow]);
  const tableHeaders = columnTitles;
  utils.sheet_add_aoa(worksheet, [tableHeaders], { origin: 4 });
  const tableData = data.map((detail) => [
    detail.date,
    detail.dealer_name,
    detail.dealer_address,
    detail.dealer_contact,
    detail.dealer_category,
    detail.qty,
    detail.foc,
    detail.total,
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

const NormalFocReport = () => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
  });

  const [loading, setLoading] = useState(false);
  const [dateByData, setDateByData] = useState([]);
  const [showdata, setShowdata] = useState({
    terriotory: '',
    distributor: '',
    manager: '',
  });

  const [categories, setCategories] = useState([]);

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/foc-normal/distributor/date/${
          JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        dateBy,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setLoading(false);

        setDateByData(res.data.details);
        setShowdata({
          ...showdata,
          terriotory: res.data.terriotory,
          distributor: res.data.distributor,
          manager: res.data.manager,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const exportByDate = (e) => {
    e.preventDefault();
    const columnOrder = [
      'date',
      'dealer_name',
      'dealer_address',
      'dealer_contact',
      'dealer_category',
      'qty',
      'foc',
      'total',
    ];
    const columnTitles = [
      'Date',
      'Dealer name',
      'Dealer address',
      'Dealer contact',
      'Dealer category',
      'Qty',
      'Foc',
      'Value',
    ];

    const file_name = 'normal_foc_by_date.xlsx';
    const totalValue = dateByData.reduce((sum, item) => sum + item.total, 0);

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(
      columnOrder,
      columnTitles,
      dateByData,
      totalRow,
      file_name,
      showdata
    );
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Normal Foc report</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Date Range</p>
          </div>
        </div>
        <div className="form">
          <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">Date from</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setDateBy({ ...dateBy, date_from: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form__row__col">
              <div className="form__row__col__label">Date to</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setDateBy({ ...dateBy, date_to: e.target.value })
                  }
                />
              </div>
            </div>
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
              <ByDateRangeTable data={dateByData} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs{' '}
              {dateByData.reduce(
                (sum, item) => sum + item.cash + item.credit + item.cheque,
                0
              )}
              /-
            </p>
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
  );
};

export default NormalFocReport;
