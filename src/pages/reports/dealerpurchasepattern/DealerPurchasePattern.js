import React, { useEffect, useState } from 'react';
import ByDateRangeTable from './ByDateRangeTable';
import { utils, writeFile } from 'xlsx';
import { formatNumberPrice } from '../../../var/NumberFormats';
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

const DealerPurchasePattern = (props) => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
    dealer: '',
    invoice: '',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });

  const [loading, setLoading] = useState(false);
  const [dateByData, setDateByData] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [invoice, setInvoices] = useState([]);
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
    setDealers([]);
    setInvoices([]);
  };

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(`/reports/dealer-pattern/purchase/date/`, dateBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setDealers(res.data.dealers);
        setInvoices(res.data.invoices);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleShowFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/dealer-pattern/purchase/distributor/data/${JSON.parse(sessionStorage.getItem('user_details')).id
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
      'item_code',
      'description',
      'qty',
      'foc',
      'price',
      'discount',
      'extended_price',
    ];
    const columnTitles = [
      'Item code',
      'Item description',
      'Qty',
      'Foc',
      'Price',
      'Discount',
      'Extended amount',
    ];

    const file_name = 'dealer_purchase_pattern.xlsx';
    const totalValue = dateByData.reduce(
      (sum, item) => sum + parseFloat(item.extended_price),
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
        <p>Dealer purchasing pattern</p>
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
                    setDateBy({ ...dateBy, date_from: e.target.value })
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
          <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">Dealers</div>
              <div className="form__row__col__input">
                <select
                  defaultValue={0}
                  name=""
                  id=""
                  onChange={(e) =>
                    setDateBy({ ...dateBy, dealer: e.target.value })
                  }
                >
                  <option value="0">Select Dealer</option>
                  {dealers.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form__row__col">
              <div className="form__row__col__label">Invoices</div>
              <div className="form__row__col__input">
                <select
                  defaultValue={0}
                  name=""
                  id=""
                  onChange={(e) =>
                    setDateBy({ ...dateBy, invoice: e.target.value })
                  }
                >
                  <option value="0">Select Invoice</option>
                  {invoice.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className="form__row__col dontdisp"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <button className="btnEdit" onClick={(e) => handleShowFilter(e)}>
                Show
              </button>
            </div>
          </div>
        </div>

        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <ByDateRangeTable data={dateByData} loading={loading} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs{' '}
              {formatNumberPrice(dateByData.reduce(
                (sum, item) => sum + parseFloat(item.extended_price),
                0
              ))}
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

export default DealerPurchasePattern;
