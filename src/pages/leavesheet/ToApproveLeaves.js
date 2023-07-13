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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Spinner from '../../components/loadingSpinner/Spinner';
import EditIcon from '@mui/icons-material/Edit';
import LeaveDetails from '../../components/details/LeaveDetails';
import EditLeave from '../../components/edit/EditLeave';
import DeleteNotBuy from '../../components/userComfirm/DeleteNotBuy';
import ApproveLeave from '../../components/userComfirm/ApproveLeave';

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
const ToApproveLeaves = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    { title: 'Name', field: 'applicant' },
    { title: 'Designation', field: 'designation' },
    { title: 'Apply Date', field: 'leave_apply_date' },
    { title: 'End Date', field: 'leave_end_date' },
    { title: 'No of  Dates', field: 'number_of_dates' },
    { title: 'Type', field: 'leave_type' },
    { title: 'Approved', field: 'leave_status' },
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

  //approve details
  const [approvedetailsOpen, setApproveDetailsOpen] = useState(false);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (user.is_company) {
      setLoading(true);

      axiosInstance
        .get(`/leave/all/by/company/`, {
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
          console.log(err);
          setLoading(false);
        });
    }
    if (user.is_manager) {
      setLoading(true);

      axiosInstance
        .get(
          `/leave/all/by/manager/${
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
          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [success]);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    console.log(value);
    setItemDetails({
      id: value.id,
      is_annual: value.is_annual,
      is_casual: value.is_casual,
      leave_apply_date: value.leave_apply_date,
      is_sick: value.is_sick,
      leave_end_date: value.leave_end_date,
      leave_status: value.leave_status,
      leave_type: value.leave_type,
      number_of_dates: value.number_of_dates,
      reason: value.reason,
      created_by: value.created_by,
      return_to_work: value.return_to_work,
      salesref: value.salesref,
    });
    setMessageOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(false);
    setApproveDetailsOpen(false);

    setDetailsOpen(true);

    handleModalOpen();
  };

  const handleEditDetails = (e, value) => {
    setItemDetails({
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
    setApproveDetailsOpen(false);

    setEditDetailsOpen(true);
    handleModalOpen();
  };
  const handleDeleteDetails = (e, value) => {
    setItemDetails({
      id: value.id,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setApproveDetailsOpen(false);

    setDeleteDetailsOpen(true);
    handleModalOpen();
  };
  const handleApproveDetails = (e, value) => {
    setItemDetails({
      id: value.id,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(false);
    setApproveDetailsOpen(true);
    handleModalOpen();
  };

  return (
    <div>
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
          <LeaveDetails
            data={itemDetails}
            showDetails={setDetailsOpen}
            showEdit={setEditDetailsOpen}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            user={user}
          />
        ) : editdetailsOpen ? (
          <EditLeave
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
            url={'/distributor/items/edit'}
          />
        ) : deletedetailsOpen ? (
          <DeleteNotBuy
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            url={'/leave/delete'}
          />
        ) : approvedetailsOpen ? (
          <ApproveLeave
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showConfirm={setApproveDetailsOpen}
            closeModal={handleModalClose}
            url={'/leave/approve'}
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
        <p>View Not Approved Leaves</p>
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
                    icon: CgDetailsMore,
                    tooltip: 'View details',
                    onClick: (event, rowData) =>
                      handleViewDetails(event, rowData),
                  },
                  {
                    icon: EditIcon,
                    tooltip: 'Edit details',
                    onClick: (event, rowData) =>
                      handleEditDetails(event, rowData),
                  },
                  {
                    icon: DeleteOutline,
                    tooltip: 'Delete details',
                    onClick: (event, rowData) =>
                      handleDeleteDetails(event, rowData),
                  },
                  {
                    icon: CheckCircleOutlineIcon,
                    tooltip: 'Approve details',
                    onClick: (event, rowData) =>
                      handleApproveDetails(event, rowData),
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
                      ) : props.action.icon === EditIcon &&
                        user.is_salesref &&
                        props.data.leave_status !== 'Yes' ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'orange' }} // customize the button style
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <EditIcon />
                        </IconButton>
                      ) : props.action.icon === DeleteOutline &&
                        user.is_salesref &&
                        props.data.leave_status !== 'Yes' ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'red' }} // customize the button style
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <DeleteOutline />
                        </IconButton>
                      ) : props.action.icon === CheckCircleOutlineIcon &&
                        (user.is_manager || user.is_company) ? (
                        <IconButton
                          onClick={(event) =>
                            props.action.onClick(event, props.data)
                          }
                          color="primary"
                          style={{ color: 'blue' }} // customize the button style
                          size="small"
                          aria-label={props.action.tooltip}
                        >
                          <CheckCircleOutlineIcon />
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

export default ToApproveLeaves;
