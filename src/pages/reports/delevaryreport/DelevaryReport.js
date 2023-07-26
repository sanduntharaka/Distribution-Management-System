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

const DelevaryReport = (props) => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });
  const [categoryBy, setCategoryBy] = useState({
    category: '-1',
    item: '-1',
    date_from: '',
    date_to: '',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });
  const [loading, setLoading] = useState(false);

  const [dateLoading, setDateLoading] = useState(false);
  const [cateLoading, setCateLoading] = useState(false);

  const [dateByData, setDateByData] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
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
    setLoading(true);
    axiosInstance
      .get(`distributor/all/${props.inventory}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setDescriptions(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

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
    setDateBy({
      ...dateBy,
      distributor: e.target.value,
    });
    setDateByData([]);
  };

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setDateLoading(true);

    axiosInstance
      .post(`/reports/deleverydetails/date/`, dateBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setDateLoading(false);

        const result = Object.values(
          res.data.reduce((acc, item) => {
            const { date, total } = item;

            if (acc[date]) {
              acc[date].total += total;
              acc[date].count += 1;
            } else {
              acc[date] = { ...item };
              acc[date].count = 1;
            }
            return acc;
          }, {})
        );
        setDateByData(result);
      })
      .catch((err) => {
        setDateLoading(false);
        console.log(err);
      });
  };

  const exportByDate = (e) => {
    e.preventDefault();
    const columnOrder = ['date', 'total', 'count'];
    const columnTitles = ['Date', 'Value', 'Pc'];

    const file_name = 'deleveryreport_by_date.xlsx';
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
    setCateLoading(true);

    axiosInstance
      .post(`/reports/deleverydetails/category/`, categoryBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setCateLoading(false);
        setCategoryByData(res.data);
      })
      .catch((err) => {
        setCateLoading(false);
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
              <ByDateRangeTable data={dateByData} loading={dateLoading} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs {dateByData.reduce((sum, item) => sum + item.total, 0)}
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
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Category</p>
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
                    onChange={(e) => handleDistributorCategory(e)}
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
              <div className="form__row__col__label">Date from</div>
              <div className="form__row__col__input">
                <input
                  type="date"
                  onChange={(e) =>
                    setCategoryBy({ ...categoryBy, date_from: e.target.value })
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
                    setCategoryBy({ ...categoryBy, date_to: e.target.value })
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
            <div className="form__row__col">
              <div className="form__row__col__label">Product</div>
              <div className="form__row__col__input">
                <select
                  name=""
                  id=""
                  defaultValue={'-1'}
                  onChange={(e) =>
                    setCategoryBy({ ...categoryBy, item: e.target.value })
                  }
                >
                  <option value="-1">All</option>
                  {descriptions.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.description}
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
              <ByCategoryTable data={categoryByData} loading={cateLoading} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs{' '}
              {categoryByData.reduce(
                (sum, item) => sum + item.extended_price,
                0
              )}
              /-
            </p>
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
