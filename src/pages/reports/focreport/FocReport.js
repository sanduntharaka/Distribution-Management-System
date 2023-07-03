import React, { useEffect, useState, useCallback } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';

import FocReportTable from './FocReportTable';

const FocReport = () => {
  const [filterData, setFilterData] = useState({
    date_from: '',
    date_to: '',
    stock_type: '1',
    category: '-1',
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
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
  }, []);
  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(
        `/reports/focreport/get/${
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
        console.log(res.data);
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const handleExport = (e) => {
    e.preventDefault();
    // Calculate the total quantity
    const columnOrder = ['date', 'invoice_number', 'qty', 'foc'];
    const columnTitles = ['Date', 'Invoice number', 'Qty', 'FOC'];

    const dataWithoutTableData = data.map(({ tableData, id, ...item }) => item);

    // Create a new workbook
    const workbook = utils.book_new();

    // Create a new worksheet
    const worksheet = utils.json_to_sheet(dataWithoutTableData, {
      header: columnOrder,
    });

    // Set the column titles
    columnTitles.forEach((title, index) => {
      const cellAddress = utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress].v = title;
    });

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Generate the Excel file
    writeFile(workbook, 'focReport.xlsx');
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Foc report</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by</p>
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
                    setFilterData({ ...filterData, date_from: e.target.value })
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
                    setFilterData({ ...filterData, date_to: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form__row__col">
              <div className="form__row__col__label">Category</div>
              <div className="form__row__col__input">
                <select
                  name=""
                  id=""
                  defaultValue={'-1'}
                  onChange={(e) =>
                    setFilterData({ ...filterData, category: e.target.value })
                  }
                >
                  <option value="-1">All</option>
                  {categories.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
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
              <FocReportTable data={data} loading={loading} />
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

export default FocReport;
