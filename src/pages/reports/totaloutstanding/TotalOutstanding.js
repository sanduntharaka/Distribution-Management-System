import React, { useEffect, useState } from 'react';
import ByDateRangeTable from './ByDateRangeTable';
import { utils, writeFile } from 'xlsx';

import { axiosInstance } from '../../../axiosInstance';

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

const TotalOutstanding = () => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
  });

  const [loading, setLoading] = useState(false);
  const [dateByData, setDateByData] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/outstanding/distributor/date/${
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
        console.log(res.data);
        setDateByData(res.data);
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
      'invoice_number',
      'invoice_amount',
      'total_payed',
      'balance_amount',
      'due_date',
    ];
    const columnTitles = [
      'Date',
      'Invoice number',
      'Invoice amount',
      'Invoice payed',
      'Balance amount',
      'Due date',
    ];

    const file_name = 'total_outstanding_report_by_date.xlsx';
    const totalValue = dateByData.reduce(
      (sum, item) => sum + parseFloat(item.balance_amount),
      0
    );

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(columnOrder, columnTitles, dateByData, totalRow, file_name);
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Distributor total outstanding report</p>
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
                (sum, item) => sum + parseFloat(item.balance_amount),
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

export default TotalOutstanding;
