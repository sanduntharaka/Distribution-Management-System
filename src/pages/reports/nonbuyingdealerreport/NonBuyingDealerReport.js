import React, { useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { utils, writeFile } from 'xlsx';
import NonbuyingDealerTable from './NonbuyingDealerTable';

const NonBuyingDealerReport = () => {
  const [dateBy, setDateBy] = useState({
    date_from: '',
    date_to: '',
  });
  const [loading, setLoading] = useState(false);

  const [dateByData, setDateByData] = useState([]);

  const handleDateByFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post(
        `/reports/non-buying/by/distributor/date/${
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
    // const columnOrder = ['dealer', 'psa', 'reason'];
    // const columnTitles = ['Dealer name', 'PSA', 'Reason'];

    const file_name = 'non_buy_by_date.xlsx';

    const workbook = utils.book_new();

    // Create worksheet
    const worksheet = utils.aoa_to_sheet([]);

    // Add Terriotory and Distributor titles and values
    const territoryRow = ['Terriotory', dateByData.terriotory];
    const distributorRow = ['Distributor', dateByData.Distributor];
    utils.sheet_add_aoa(worksheet, [territoryRow, distributorRow]);

    // Add table headers
    const tableHeaders = ['Dealer', 'PSA', 'Reason'];
    utils.sheet_add_aoa(worksheet, [tableHeaders], { origin: 3 });

    // Add table data
    const tableData = dateByData.details.map((detail) => [
      detail.dealer,
      detail.psa,
      detail.reason,
    ]);
    utils.sheet_add_aoa(worksheet, tableData, { origin: 4 });

    // Add worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Export the workbook to a file
    writeFile(workbook, file_name);
  };

  return (
    <div className="page">
      <div className="page__title">
        <p>Non buying dealers report</p>
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
              <NonbuyingDealerTable data={dateByData.details} />
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

export default NonBuyingDealerReport;
