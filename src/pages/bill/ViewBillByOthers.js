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
import ViewBill from './confim_bill/ViewBill';
import RecommendIcon from '@mui/icons-material/Recommend';
import PaymentDetails from './confim_bill/PaymentDetails';
import { MdOutlinePayment } from "react-icons/md";

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

const ViewBillByOthers = ({ user }) => {
  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Added By', field: 'added_by' },
    { title: 'Bill No', field: 'code' },
    { title: 'Date', field: 'date' },
    { title: 'Dealer', field: 'dealer_name' },
    { title: 'Total', field: 'total' },

    { title: 'Status', field: 'status' },
  ];
  const [loading, setLoading] = useState(false);
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  //payment
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [distributors, setDistributors] = useState([]);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [invoice, setInvoice] = useState();
  const [items, setItems] = useState();
  const [dataSingle, setSataSingle] = useState();

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

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    setInvoice(value);
    setSataSingle(value);
    axiosInstance
      .get(`/salesref/invoice/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItems(res.data);
        setMessageOpen(false);
        setDetailsOpen(true);
        handleModalOpen();
      })
      .catch((err) => {
        console.log(err);
        setDetailsOpen(false);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Cannot find any items');
        setTitle('Error');
        setMessageOpen(true);
        handleModalOpen();
      });
  };

  const handleFilterInventory = (e) => {
    if (e.target.value !== '') {
      setLoading(true);

      axiosInstance
        .get(
          `/salesref/invoice/all/invoice/by/others/distributor/${e.target.value}`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
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
  const handleViewPayments = (e, value) => {
    e.preventDefault();
    setLoading(true);
    setInvoice(value);
    setSataSingle(value);
    console.log('inv:', value)
    axiosInstance
      .get(`/salesref/invoice/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItems(res.data);
        setDetailsOpen(false);
        setMessageOpen(false);
        setPaymentOpen(true);

        handleModalOpen();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

  }
  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <ViewBill
        issued_by={props.issued_by}
        items={props.items}
        invoice={props.invoice}
        data={props.data}
        user={props.user}
        close={() => props.handleClose()}
      />
    );
  });

  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <MyInvoice
            issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
            items={items}
            invoice={invoice}
            oldinv={false}
            data={dataSingle}
            user={user}
            handleClose={handleModalClose}
          />
        ) : paymentOpen ? <PaymentDetails
          invoice={invoice}
          selected={invoice}
          showEditCheques={false}
          paymentOpen={setPaymentOpen}
          setPaymentId={''}
          closeModal={handleModalClose}
        /> : messageOpen ? (
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
        <p>View all Issued Bills</p>
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
                  pageSize: 50,
                  pageSizeOptions: [50, 75, 100],
                }}
                icons={tableIcons}
                actions={[
                  {
                    icon: CgDetailsMore,
                    tooltip: 'View details',
                    onClick: (event, rowData) =>
                      handleViewDetails(event, rowData),
                  },
                  {
                    icon: MdOutlinePayment,
                    tooltip: 'View payments',
                    onClick: (event, rowData) =>
                      handleViewPayments(event, rowData),
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
                      ) : props.action.icon === MdOutlinePayment && props.data.status == 'confirmed' ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'orange' }} // customize the icon color
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <MdOutlinePayment />
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

export default ViewBillByOthers;
