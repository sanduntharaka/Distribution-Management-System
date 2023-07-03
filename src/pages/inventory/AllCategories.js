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

import EditCategory from '../../components/edit/EditCategory';
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

const AllCategories = (props) => {
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
    { title: 'Category Name', field: 'category_name' },
    { title: 'Details', field: 'description' },
    { title: 'Foc(%)', field: 'foc_percentage' },
    { title: 'Created', field: 'date', editable: false },
  ];
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //item_codes
  const [itemCodes, setItemCodes] = useState([]);

  //mesage show

  const [loading, setLoading] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/category/all/`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
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
        setLoading(false);
        console.log(err);
      });
  }, [success, props.success]);

  const handleEdit = (newData, oldData, resolve) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .put(`/category/update/${newData.id}`, newData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Category has been updated successfully');
        handleModalOpen();
        resolve();
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Server error!, Please try again');
        handleModalOpen();
        resolve();
      });
  };
  const handleDelete = (oldData, resolve) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .delete(`/category/delete/${oldData.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Category has been deleted successfully');
        handleModalOpen();
        resolve();
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Server error!, Please try again');
        handleModalOpen();
        resolve();
      });
  };
  const handleFilter = (i) => {
    handleClose();
    console.log(i);
    if (i === 'all') {
      setTableData(data);
    } else {
      let filteredItems = data.filter((item) => item.created_by === i);
      console.log(filteredItems);
      setTableData(filteredItems);
    }
  };
  return (
    <>
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
                isLoading={loading}
                title={false}
                columns={columns}
                data={tblData}
                icons={tableIcons}
                editable={
                  props.user.is_manager || props.user.is_superuser
                    ? {
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            handleEdit(newData, oldData, resolve);
                          }),

                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            handleDelete(oldData, resolve);
                          }),
                      }
                    : ''
                }
              />
              {/* </section> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCategories;
