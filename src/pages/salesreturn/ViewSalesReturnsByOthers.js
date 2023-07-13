import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';

import Message from '../../components/message/Message';
import { CgDetailsMore } from 'react-icons/cg';
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
import ViewBill from './bill/ViewBill';
import Spinner from '../../components/loadingSpinner/Spinner';
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

const ViewSalesReturnsByOthers = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Invoice', field: 'code' },

    { title: 'Psa', field: 'psa_name' },
    { title: 'Dealer', field: 'dealer_name' },
    { title: 'Date', field: 'date' },
    { title: 'Added by', field: 'added_name' },
  ];

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();
  const [returnItems, setReturnItems] = useState([]);

  const [distributors, setDistributors] = useState([]);

  const [loading, setLoading] = useState(false);
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
          setDetailsOpen(false);
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
          setDetailsOpen(false);
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
          setDetailsOpen(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot find any istributor');
          setTitle('Error');
          setMessageOpen(true);
          handleModalOpen();
          console.log(err);
        });
    }
  }, [messageOpen, success]);

  useEffect(() => {
    if (user.is_salesref) {
      setLoading(true);
      axiosInstance
        .get(
          `/salesreturn/return/get/salesref/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
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
          setData(res.data);
          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    if (user.is_distributor) {
      setLoading(true);
      axiosInstance
        .get(
          `/salesreturn/return/get/distributor/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
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
          setData(res.data);
          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, ['']);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .get(`/salesreturn/return/get/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setItemDetails(value);
        setReturnItems(res.data);
        setMessageOpen(false);
        setDetailsOpen(true);

        handleModalOpen();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Cannot view bill. Beacause you did not added items. Please delete the bill.'
        );
        setDetailsOpen(false);

        setMessageOpen(true);

        handleModalOpen();
      });
  };

  const [distributor, setDistributor] = useState();
  const handleFilterInventory = (e) => {
    if (e.target.value !== '') {
      setLoading(true);
      setDistributor(e.target.value);
      axiosInstance
        .get(`/salesreturn/return/get/distributor/${e.target.value}`, {
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

  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <ViewBill
        items={props.items}
        invoice={props.invoice}
        data={props.data}
        user={props.user}
        close={() => props.handleClose()}
      />
    );
  });
  const ShowMessage = forwardRef((props, ref) => {
    return (
      <Message
        hide={() => props.handleClose()}
        success={props.success}
        error={props.error}
        title={props.title}
        msg={props.msg}
        ref={ref}
      />
    );
  });

  return (
    <div className="page">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <MyInvoice
            items={returnItems}
            invoice={itemDetails}
            oldinv={false}
            data={itemDetails}
            user={user}
            handleClose={handleModalClose}
          />
        ) : messageOpen ? (
          <ShowMessage
            handleClose={handleModalClose}
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
        <p>View All Issued Sales Returns</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <div className="page__pcont__row">
            <div className="page__pcont__row__col">
              <div className="form__row">
                <div className="form__row__col">
                  <div className="form__row__col__label">Distributor</div>
                  <div className="form__row__col__input">
                    <select
                      defaultValue={''}
                      onChange={handleFilterInventory}
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
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <MaterialTable
                title={false}
                columns={columns}
                data={tblData}
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
                actions={[
                  {
                    icon: CgDetailsMore,
                    tooltip: 'View details',
                    onClick: (event, rowData) =>
                      handleViewDetails(event, rowData),
                  },
                ]}
                components={{
                  Action: (props) => (
                    <React.Fragment>
                      {props.action.icon === CgDetailsMore ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'green' }} // customize the icon color
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <CgDetailsMore />
                        </IconButton>
                      ) : (
                        ''
                      )}
                    </React.Fragment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSalesReturnsByOthers;
