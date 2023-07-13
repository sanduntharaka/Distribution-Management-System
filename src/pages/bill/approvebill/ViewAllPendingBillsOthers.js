import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import Modal from '@mui/material/Modal';
import Message from '../../../components/message/Message';
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

import RecommendIcon from '@mui/icons-material/Recommend';
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
  Recommend: forwardRef((props, ref) => <RecommendIcon {...props} ref={ref} />),
};

const ViewAllPendingBillsOthers = ({ user }) => {
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Added by', field: 'added_by' },
    { title: 'Bill No', field: 'code' },
    { title: 'Date', field: 'date' },
    { title: 'Dealer', field: 'dealer_name' },
    { title: 'Total', field: 'total' },

    { title: 'Status', field: 'status' },
  ];
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

  //filter_lists
  const [distributors, setDistributors] = useState([]);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setLoading(true);
    if (user.is_manager) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/manager/${user.id}`, {
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
          setLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('You have not any distributor assigned');
          setTitle('Error');
          setMessageOpen(true);
          handleModalOpen();
          console.log(err);
        });
    }
    if (user.is_excecutive) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/executive/${user.id}`, {
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
          setLoading(false);

          setSuccess(false);
          setError(true);
          setMsg('You have not any distributor assigned');
          setTitle('Error');
          setMessageOpen(true);
          handleModalOpen();
          console.log(err);
        });
    }
    if (user.is_company) {
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
          setLoading(false);

          setSuccess(false);
          setError(true);
          setMsg('Cannot find any istributor');
          setTitle('Error');
          setMessageOpen(true);
          handleModalOpen();
          console.log(err);
        });
    }
    if (user.is_salesref) {
      setLoading(true);
      axiosInstance
        .get(`distributor/salesref/get/distributor/by/salesref/${user.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          handleFilterInventory(res.data.distributor_id);
        })
        .catch((err) => {
          setLoading(false);

          setSuccess(false);
          setError(true);
          setMsg('You have not any distributor assigned');
          setTitle('Error');
          setMessageOpen(true);
          handleModalOpen();
          console.log(err);
        });
    }
  }, [messageOpen, success]);

  const handleFilterInventory = (value) => {
    if (value !== '') {
      setLoading(true);

      axiosInstance
        .get(`/salesref/invoice/all/pending/invoices/by/others/${value}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);
          setTableData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setTableData([]);

          console.log(err);
        });
    }
  };

  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {messageOpen ? (
          <Message
            hide={handleModalClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        ) : (
          <p>No modal</p>
        )}
      </Modal>
      <div className="page__title">
        <p>View All Pending Bills</p>
      </div>
      <div className="page__pcont">
        {!user.is_salesref ? (
          <div className="form">
            <div className="page__pcont__row">
              <div className="page__pcont__row__col">
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Distributor</div>
                    <div className="form__row__col__input">
                      <select
                        defaultValue={''}
                        onChange={(e) => handleFilterInventory(e.target.value)}
                        required
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
                  <div className="form__row__col dontdisp"></div>
                  <div className="form__row__col dontdisp"></div>
                  <div className="form__row__col dontdisp"></div>
                </div>
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
                title={false}
                columns={columns}
                data={tblData}
                isLoading={loading}
                sx={{
                  ['&.MuiTable-root']: {
                    background: 'red',
                  },
                }}
                actionsColumnIndex={-1} // hide the actions column from view
                actionsCellStyle={{
                  // customize the actions cell style
                  background: '#fde',
                }}
                options={{
                  exportButton: true,
                  actionsColumnIndex: 0,
                }}
                icons={tableIcons}
              />
            </div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col total">
            <p>Total</p>
            <p>Rs {tblData.reduce((sum, item) => sum + item.total, 0)}/-</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewAllPendingBillsOthers;
