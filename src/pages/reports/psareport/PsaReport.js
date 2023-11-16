import React, { useEffect, useState, forwardRef } from 'react';
import { utils, writeFile } from 'xlsx';
import { axiosInstance } from '../../../axiosInstance';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const PsaReport = (props) => {
  const [data, setData] = useState([]);
  const [expData, setExpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    distributor: '',
  });
  const [dateByData, setDateByData] = useState([]);

  const columns = [
    { title: 'PSA', field: 'psa', defaultGroupOrder: 0 },
    { title: 'Category', field: 'category' },
    { title: 'Count', field: 'count', type: 'numeric' },
  ];

  useEffect(() => {
    // if (JSON.parse(sessionStorage.getItem('user')).is_manager) {
    //   axiosInstance
    //     .get(
    //       `/reports/delaerdetails/by/manager/${
    //         JSON.parse(sessionStorage.getItem('user_details')).id
    //       }`,
    //       {
    //         headers: {
    //           Authorization:
    //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       setData(res.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
    if (JSON.parse(sessionStorage.getItem('user')).is_distributor) {
      axiosInstance
        .get(
          `/reports/psadetails/distributor/${JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setExpData(res.data);
          let res_data = res.data;
          const result = res_data.psas.flatMap((psa) =>
            res_data.category_names.map((category) => ({
              psa,
              category,
              count: res_data.details[psa][category],
            }))
          );
          setData(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (JSON.parse(sessionStorage.getItem('user')).is_salesref) {
      axiosInstance
        .get(
          `/reports/psadetails/salesref/${JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setExpData(res.data);
          let res_data = res.data;
          const result = res_data.psas.flatMap((psa) =>
            res_data.category_names.map((category) => ({
              psa,
              category,
              count: res_data.details[psa][category],
            }))
          );
          setData(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
      .get(`/reports/psadetails/distributor/${filterData.distributor}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setExpData(res.data);
        let res_data = res.data;
        const result = res_data.psas.flatMap((psa) =>
          res_data.category_names.map((category) => ({
            psa,
            category,
            count: res_data.details[psa][category],
          }))
        );
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("EXPD:", expData)
  const exportByCategory = (e) => {
    e.preventDefault();
    const file_name = 'psa_report.xlsx';
    const workbook = utils.book_new();
    // // Create worksheet
    const worksheet = utils.aoa_to_sheet([]);
    // Add Terriotory and Distributor titles and values
    const territoryRow = ['Terriotory', expData.terriotory];
    const managerRow = ['Manager', expData.manager_name];
    const distributorRow = ['Distributor', expData.distributor_name];
    utils.sheet_add_aoa(worksheet, [territoryRow, managerRow, distributorRow]);
    // // Add table headers
    const { category_names, psas, details } = expData;
    const data = [];

    // Create header row
    const headerRow = ['PSA', ...category_names];
    data.push(headerRow);

    // Add data rows
    psas.forEach((psa) => {
      const row = [
        psa,
        ...category_names.map((category) => details[psa][category]),
      ];
      data.push(row);
    });

    utils.sheet_add_aoa(worksheet, data, { origin: 4 });
    // Add worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    // Export the workbook to a file
    writeFile(workbook, file_name);
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Psa report</p>
      </div>
      <div className="page__pcont">
        {props.user.is_manager ||
          props.user.is_company ||
          props.user.is_excecutive ? (
          <div className="form">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Distributor</div>
                <div className="form__row__col__input">
                  <select
                    name=""
                    id=""
                    defaultValue={'1'}
                    onChange={(e) => handleDistributor(e)}
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
        ) : (
          ''
        )}
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <MaterialTable
                columns={columns}
                data={data}
                icons={tableIcons}
                title={false}
              />
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

export default PsaReport;
