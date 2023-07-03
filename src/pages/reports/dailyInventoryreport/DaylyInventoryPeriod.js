import React, { useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';
import InventoryStatusTable from './InventoryStatusTable';
function exportExcell(columnOrder, columnTitles, data, file_name) {
  const dataWithoutTableData = data.map(({ tableData, id, ...item }) => item);
  const workbook = utils.book_new();
  const worksheet = utils.json_to_sheet(dataWithoutTableData, {
    header: columnOrder,
  });
  columnTitles.forEach((title, index) => {
    const cellAddress = utils.encode_cell({ r: 0, c: index });
    worksheet[cellAddress].v = title;
  });

  utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
  writeFile(workbook, file_name);
}

const DaylyInventoryPeriod = () => {
  const [filterData, setFilterData] = useState({
    date: '',
  });
  const [loading, setLoading] = useState(false);

  const [dateByData, setDateByData] = useState([]);

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/invent-status/get/${
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
      'date',
      'item_code',
      'category',
      'description',
      'qty',
      'foc',
    ];
    const columnTitles = [
      'Date',
      'Item code',
      'Category',
      'Description',
      'Qty',
      'Foc',
    ];

    const file_name = 'inventory_status.xlsx';

    exportExcell(columnOrder, columnTitles, dateByData, file_name);
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Distributor inventory by date</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Date</p>
          </div>
        </div>
        <div className="form">
          <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">Date</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setFilterData({ ...filterData, date: e.target.value })
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
              <InventoryStatusTable data={dateByData} loading={loading} />
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

export default DaylyInventoryPeriod;
