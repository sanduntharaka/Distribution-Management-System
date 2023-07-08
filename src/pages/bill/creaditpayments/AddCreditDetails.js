import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import Message from '../../../components/message/Message';
import { SiMoneygram } from 'react-icons/si';
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
import ConfirmStatus from './ConfirmStatus';
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

const AddCreditDetails = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [data, setData] = useState([]);
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
    { title: 'Payed', field: 'payed' },
    { title: 'Due date', field: 'due_date' },

    { title: 'Status', field: 'status' },
  ];
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();

  //edit-details
  const [editdetailsOpen, setEditDetailsOpen] = useState(false);

  //delete-details
  const [deletedetailsOpen, setDeleteDetailsOpen] = useState(false);

  //filter_lists
  const [sales_refs, setSales_refs] = useState([]);
  const [distributors, setDistributors] = useState([]);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axiosInstance
      .get(
        `/salesref/invoice/all/credit/invoices/${
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
        console.log(res.data);
        setData(res.data);
        setTableData(res.data);
        res.data.forEach((item) => {
          if (!sales_refs.includes(item.sales_ref)) {
            sales_refs.push(item.sales_ref);
          }
        });
        res.data.forEach((item) => {
          if (!distributors.includes(item.distributor)) {
            distributors.push(item.distributor);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messageOpen]);
  const [invoice, setInvoice] = useState();
  const [items, setItems] = useState();
  const [dataSingle, setSataSingle] = useState();
  const handleViewDetails = (e, value) => {
    e.preventDefault();
    console.log(value);
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
        console.log(res);
        setItems(res.data);
        setMessageOpen(false);
        setEditDetailsOpen(false);
        setDeleteDetailsOpen(false);
        setDetailsOpen(true);
        handleModalOpen();
      })
      .catch((err) => {
        console.log();
      });
  };

  const handleEditDetails = (e, value) => {
    setInvoice({
      id: value.id,
      name: value.name,
      contact_number: value.contact_number,
      address: value.address,
      owner_name: value.owner_name,
      company_number: value.company_number,
      owner_personal_number: value.owner_personal_number,
      owner_home_number: value.owner_home_number,
      assistant_name: value.assistant_name,
      assistant_contact_number: value.assistant_contact_number,
      added: value.added,
    });

    setMessageOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(true);
    handleModalOpen();
  };
  const handleConfirmDetails = (e, value) => {
    setInvoice(value);
    setMessageOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(true);
    handleModalOpen();
  };
  const handleFilter = (i) => {
    handleClose();
    console.log(i);
    if (i === 'all') {
      setTableData(data);
    } else {
      let filteredItems = data.filter((item) => item.distributor === i);
      console.log(filteredItems);
      setTableData(filteredItems);
    }
  };

  const handleFilterSalesRef = (i) => {
    handleClose();
    console.log(i);
    if (i === 'all') {
      setTableData(data);
    } else {
      let filteredItems = data.filter((item) => item.sales_ref === i);
      console.log(filteredItems);
      setTableData(filteredItems);
    }
  };
  const MyInvoiceConfirm = React.forwardRef((props, ref) => {
    return (
      <ConfirmStatus
        invoice={props.invoice}
        openMsg={props.openMsg}
        msgSuccess={props.msgSuccess}
        msgErr={props.msgErr}
        msgTitle={props.msgTitle}
        msg={props.msg}
        showEdit={props.showEdit}
        closeModal={props.closeModal}
        user={props.user}
      />
    );
  });
  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {editdetailsOpen ? (
          <MyInvoiceConfirm
            invoice={invoice}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
            user={user}
          />
        ) : messageOpen ? (
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
        <p>View All Credit Bills</p>
      </div>
      <div className="page__pcont">
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
                    icon: SiMoneygram,
                    tooltip: 'Confirm',
                    onClick: (event, rowData) =>
                      handleConfirmDetails(event, rowData),
                  },
                ]}
                components={{
                  Action: (props) => (
                    <React.Fragment>
                      {props.action.icon === SiMoneygram ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'orange' }} // customize the icon color
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <SiMoneygram />
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
export default AddCreditDetails;
