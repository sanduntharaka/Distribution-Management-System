import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';
import MarketCreditTable from './MarketCreditTable';
import { formatNumberPrice } from '../../../var/NumberFormats';
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

const MarketCreditReport = (props) => {
  const [filterData, setFilterData] = useState({
    period: '0',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });
  const [loading, setLoading] = useState(false);

  const [dateByData, setDateByData] = useState([]);
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
    setDateByData([]);
  };
  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(`/reports/credit/by/period/`, filterData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
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
      'confirmed_date',
      'dealer',
      'address',
      'invoice_number',
      'total',
      'paid_amount',
      'balance',
    ];
    const columnTitles = [
      'Delivery date',
      'Dealer name',
      'Address',
      'Invoice number',
      'Original amount',
      'Paid amount',
      'Balance',
    ];

    const file_name = 'market_credit_by_period.xlsx';
    const totalValue = dateByData.reduce((sum, item) => sum + item.balance, 0);

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(columnOrder, columnTitles, dateByData, totalRow, file_name);
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Market credit bills report</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row ">
          <div className="page__pcont__row__col">
            <p>Filter by Date period</p>
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
                  <option value="6">Over 121 to 150d</option>
                  <option value="7">Over 151 d</option>
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
              <MarketCreditTable data={dateByData} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total balance</p>
            <p>
              Rs {formatNumberPrice(dateByData.reduce((sum, item) => sum + item.balance, 0))}
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

export default MarketCreditReport;
