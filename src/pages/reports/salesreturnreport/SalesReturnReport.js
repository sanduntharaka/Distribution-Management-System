import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';
import SalesReturnTable from './SalesReturnTable';
import { formatNumberPrice } from '../../../var/NumberFormats';
const SalesReturnReport = (props) => {
  const [filterData, setFilterData] = useState({
    date_from: '',
    date_to: '',
    filter_status: -1,
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const handleDistributor = (e) => {
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
      .post(`/reports/salesreturns/get/`, filterData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
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

    const columnOrder = [
      'item',
      'item_description',
      'reason',
      'qty',
      'sub_total',
    ];
    const columnTitles = ['Item Code', 'Description', 'Reason', 'Qty', 'Value'];

    const dataWithoutTableData = data.map(({ tableData, id, ...item }) => item);
    const total = data.reduce((sum, item) => sum + item.sub_total, 0);

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

    // Add the total quantity row at the bottom
    const totalRow = {
      label: 'Total',
      total: total,
    };
    const totalRowIndex = data.length + 1; // Add one to account for header row
    utils.sheet_add_json(worksheet, [totalRow], {
      header: ['label', 'total'],
      skipHeader: true,
      origin: totalRowIndex,
    });

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Generate the Excel file
    writeFile(workbook, 'sales_return.xlsx');
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Sales returns report</p>
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
                    onChange={(e) => handleDistributor(e)}
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
            <div className="form__row__col">
              <div className="form__row__col__label">Status</div>
              <div className="form__row__col__input">
                <select
                  name=""
                  id=""
                  defaultValue={'-1'}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      filter_status: e.target.value,
                    })
                  }
                >
                  <option value="-1">All</option>
                  <option value="1">Pending</option>
                  <option value="2">Approved</option>
                  <option value="3">Rejected</option>
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
              <SalesReturnTable data={data} loading={loading} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs {formatNumberPrice(data.reduce((sum, item) => sum + item.sub_total, 0))}
              /-
            </p>
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

export default SalesReturnReport;
