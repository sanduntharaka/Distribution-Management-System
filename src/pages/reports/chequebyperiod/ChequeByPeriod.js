import React, { useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';
import ChequeByPeriodTable from './ChequeByPeriodTable';
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

const ChequeByPeriod = () => {
  const [filterData, setFilterData] = useState({
    period: '0',
  });
  const [loading, setLoading] = useState(false);

  const [dateByData, setDateByData] = useState([]);

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/cheque/by/distributor/period/${
          JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        filterData,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setDateByData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const exportByDate = (e) => {
    e.preventDefault();
    const columnOrder = [
      'dealer',
      'address',
      'invoice_number',
      'given_date',
      'amount',
    ];
    const columnTitles = [
      'Dealer name',
      'Address',
      'Invoice number',
      'Dates given',
      'Amount',
    ];

    const file_name = 'cheque_by_period.xlsx';
    const totalValue = dateByData.reduce((sum, item) => sum + item.amount, 0);

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(columnOrder, columnTitles, dateByData, totalRow, file_name);
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Distributor cheque by period report</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Date period</p>
          </div>
        </div>
        <div className="form">
          <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">Period</div>
              <div className="form__row__col__input">
                <select
                  name=""
                  id=""
                  defaultValue={'0'}
                  onChange={(e) =>
                    setFilterData({ ...filterData, period: e.target.value })
                  }
                >
                  <option value="0">0-14d</option>
                  <option value="1">15-30d</option>
                  <option value="2">31-45d</option>
                  <option value="3">46-60d</option>
                  <option value="4">61-90d</option>
                  <option value="5">91-120d</option>
                  <option value="6">over 121 to 150d</option>
                  <option value="7">over 151 d</option>
                </select>
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
              <ChequeByPeriodTable data={dateByData} />
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
  );
};

export default ChequeByPeriod;
