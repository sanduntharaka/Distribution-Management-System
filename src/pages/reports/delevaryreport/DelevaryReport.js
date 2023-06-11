import React, { useEffect, useState } from 'react';
import ByDateRangeTable from './ByDateRangeTable';
import ByCategoryTable from './ByCategoryTable';
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

const DelevaryReport = () => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
  });
  const [categoryBy, setCategoryBy] = useState({
    category: '-1',
  });
  const [loading, setLoading] = useState(false);
  const [dateByData, setDateByData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryByData, setCategoryByData] = useState([]);

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
  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/deleverydetails/distributor/date/${
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
        setDateByData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const exportByDate = (e) => {
    e.preventDefault();
    const columnOrder = ['date', 'total'];
    const columnTitles = ['Date', 'Value'];

    const file_name = 'deleveryreport_by_date.xlsx';
    const totalValue = dateByData.reduce((sum, item) => sum + item.total, 0);

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(columnOrder, columnTitles, dateByData, totalRow, file_name);
  };

  const handleCategoryByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/deleverydetails/distributor/category/${
          JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        categoryBy,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
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

    const file_name = 'deleveryreport_by_category.xlsx';
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
  return (
    <div className="page">
      <div className="page__title">
        <p>Delevery report</p>
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
          <div className="page__pcont__row__col">
            <button className="btnSave" onClick={(e) => exportByDate(e)}>
              Export
            </button>
          </div>
        </div>
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Category</p>
          </div>
        </div>
        <div className="form">
          <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">Category</div>
              <div className="form__row__col__input">
                <select
                  name=""
                  id=""
                  defaultValue={'-1'}
                  onChange={(e) =>
                    setCategoryBy({ ...categoryBy, category: e.target.value })
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
              <button
                className="btnEdit"
                onClick={(e) => handleCategoryByFilter(e)}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <ByCategoryTable data={categoryByData} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <button className="btnSave" onClick={(e) => exportByCategory(e)}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelevaryReport;
