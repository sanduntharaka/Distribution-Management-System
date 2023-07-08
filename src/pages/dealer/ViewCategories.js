import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import Message from '../../components/message/Message';
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

import EditIcon from '@mui/icons-material/Edit';
import PsaEdit from '../../components/edit/PsaEdit';
import DeleteNotBuy from '../../components/userComfirm/DeleteNotBuy';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => (
    <DeleteOutline {...props} ref={ref} style={{ color: 'red' }} />
  )),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => (
    <Edit {...props} ref={ref} style={{ color: 'orange' }} />
  )),
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

const ViewCategories = (props) => {
  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      cellStyle: { width: '10px' },
      width: '10px',
      headerStyle: { width: '10px' },
      editable: false,
    },
    { title: 'Category title', field: 'category_name' },
  ];
  //   created_by
  //   area_name
  //   more_details
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

  //item_codes
  const [itemCodes, setItemCodes] = useState([]);

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
      .get(`/dealer-category/all/`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setTableData(res.data);
        res.data.forEach((item) => {
          if (!itemCodes.includes(item.created_by)) {
            itemCodes.push(item.created_by);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [success, props.success]);

  const handleRowUpdate = (newData, oldData, resolve) => {
    setSuccess(false);
    setError(false);
    axiosInstance
      .put(`/dealer-category/edit/${newData.id}`, newData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Dealer category has been updated successfully');
        handleModalOpen();
        resolve();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Delaer category cannot update right now. Please check your data again'
        );
        handleModalOpen();
        resolve();
      });
  };
  const handleRowDelete = (oldData, resolve) => {
    setSuccess(false);
    setError(false);
    axiosInstance
      .delete(`/dealer-category/delete/${oldData.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Dealer category has been deleted successfully');
        handleModalOpen();
        resolve();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Delaer category cannot delete right now. Please check your data again'
        );
        handleModalOpen();
        resolve();
      });
  };

  return (
    <div>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Message
          hide={handleModalClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>View Categories</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div className="dataTable">
              <MaterialTable
                title={false}
                columns={columns}
                data={data}
                icons={tableIcons}
                options={{
                  rowStyle: {
                    '&:hover': {
                      backgroundColor: '#EEE',
                    },
                  },
                  actionsCellStyle: {
                    '& .MuiIconButton-root.Mui-disabled': {
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                    '& .MuiIconButton-root:hover': {
                      backgroundColor: '#EEE',
                      color: 'blue',
                    },
                  },
                }}
                editable={
                  props.user.is_manager || props.user.is_company
                    ? {
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                          }),

                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            handleRowDelete(oldData, resolve);
                          }),
                      }
                    : ''
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategories;
