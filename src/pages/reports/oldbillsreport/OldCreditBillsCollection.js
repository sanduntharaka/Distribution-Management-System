import React, { useEffect, useState } from 'react';
import ByDateRangeInvoiceTable from './ByDateRangeInvoiceTable';
import { utils, writeFile } from 'xlsx';

import { axiosInstance } from '../../../axiosInstance';
import ByDateRangeChequeTable from './ByDateRangeChequeTable';

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

const OldCreditBillsCollection = (props) => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
  });

  const [loading, setLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [creditLoading, setCreditLoading] = useState(false);

  const [dateByDataInv, setDateByDataInv] = useState([]);
  const [dateByDataCheque, setDateByDataCheque] = useState([]);

  const [categories, setCategories] = useState([]);
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
  const handleDistributorMarketCredit = (e) => {
    setDateBy({
      ...dateBy,
      distributor: e.target.value,
    });
    setDateByDataInv([]);
  };
  const handleDateByFilter = (e) => {
    e.preventDefault();
    setMarketLoading(true);

    axiosInstance
      .post(`/reports/oldcredit/date/inv/`, dateBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setMarketLoading(false);

        setDateByDataInv(res.data);
      })
      .catch((err) => {
        setMarketLoading(false);
        console.log(err);
      });
  };
  const handleDistributorPDcheque = (e) => {
    setDateBy({
      ...dateBy,
      distributor: e.target.value,
    });
    setDateByDataCheque([]);
  };

  const handleDateByFilterCheque = (e) => {
    e.preventDefault();
    setCreditLoading(true);

    axiosInstance
      .post(`/reports/oldcredit/date/cheque/`, dateBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setCreditLoading(false);
        setDateByDataCheque(res.data);
      })
      .catch((err) => {
        setCreditLoading(false);
        console.log(err);
      });
  };

  const exportByDateInv = (e) => {
    e.preventDefault();
    const columnOrder = [
      'distributor',
      'customer_name',
      'inv_number',
      'inv_date',
      'original_amount',
      'paid_amount',
      'balance_amount',
      'date',
    ];
    const columnTitles = [
      'Distributor name',
      'Dealer name',
      'Invoice number',
      'Invoice date',
      'original amount',
      'Payed amount',
      'Balance amount',
      'Date',
    ];

    const file_name = 'old_credit_collection_invoice_report_by_date.xlsx';
    const totalValue = dateByDataInv.reduce(
      (sum, item) => sum + item.balance_amount,
      0
    );

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(columnOrder, columnTitles, dateByDataInv, totalRow, file_name);
  };
  const exportByDateCheque = (e) => {
    e.preventDefault();
    const columnOrder = [
      'distributor',
      'customer_name',
      'inv_number',
      'inv_date',
      'original_amount',
      'paid_amount',
      'balance_amount',
      'cheque_number',
      'bank',
      'cheque_deposite_date',
      'date',
    ];
    const columnTitles = [
      'Distributor name',
      'Dealer name',
      'Invoice number',
      'Invoice date',
      'original amount',
      'Payed amount',
      'Balance amount',
      'Cheque number',
      'Bank',
      'Deposited date',
      'Date',
    ];

    const file_name = 'old_credit_collection_cheque_report_by_date.xlsx';
    const totalValue = dateByDataCheque.reduce(
      (sum, item) => sum + item.balance_amount,
      0
    );

    const totalRow = {
      label: 'Total',
      total: totalValue,
    };

    exportExcell(
      columnOrder,
      columnTitles,
      dateByDataCheque,
      totalRow,
      file_name
    );
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Old Credit bills collection report (Market credit)</p>
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
                    onChange={(e) => handleDistributorMarketCredit(e)}
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
              <ByDateRangeInvoiceTable
                data={dateByDataInv}
                loading={marketLoading}
              />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs{' '}
              {dateByDataInv.reduce(
                (sum, item) => sum + item.balance_amount,
                0
              )}
              /-
            </p>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <button className="btnSave" onClick={(e) => exportByDateInv(e)}>
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="page__title">
        <p>Old Credit bills collection report (PD cheques)</p>
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
                    onChange={(e) => handleDistributorPDcheque(e)}
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
                onClick={(e) => handleDateByFilterCheque(e)}
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <ByDateRangeChequeTable
                data={dateByDataCheque}
                loading={creditLoading}
              />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>
              Rs{' '}
              {dateByDataCheque.reduce(
                (sum, item) => sum + item.balance_amount,
                0
              )}
              /-
            </p>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <button className="btnSave" onClick={(e) => exportByDateCheque(e)}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldCreditBillsCollection;
