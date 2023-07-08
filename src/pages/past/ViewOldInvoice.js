import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';

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

import EditIcon from '@mui/icons-material/Edit';
import Message from '../../components/message/Message';
import EditOldInv from '../../components/edit/EditOldInv';
import DeleteNotBuy from '../../components/userComfirm/DeleteNotBuy';

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

const ViewOldInvoice = (props) => {
  const user = props.user;
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Invoice', field: 'inv_number' },
    { title: 'Date', field: 'inv_date' },
    { title: 'Customer', field: 'customer_name' },

    { title: 'Original amount', field: 'original_amount' },
    { title: 'Paid amount', field: 'paid_amount' },
    { title: 'Balance amount', field: 'balance_amount' },
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

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);

  const [distributors, setDistributors] = useState([]);
  useEffect(() => {
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

          console.log(err);
        });
    } else if (user.is_excecutive) {
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

          console.log(err);
        });
    } else if (user.is_company) {
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

          console.log(err);
        });
    } else if (user.is_salesref) {
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
    } else {
      setLoading(true);

      axiosInstance
        .get(
          `/pastinv/inv/view/all/${
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
          setTableData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [success, props.success]);

  const handleEditDetails = (e, value) => {
    console.log(value);
    setItemDetails({
      id: value.id,
      balance_amount: value.balance_amount,
      customer_name: value.customer_name,
      distributor: value.distributor,
      inv_date: value.inv_date,
      inv_number: value.inv_number,
      original_amount: value.original_amount,
      paid_amount: value.paid_amount,
    });
    setMessageOpen(false);
    setDeleteDetailsOpen(false);
    setDetailsOpen(false);
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
    setDeleteDetailsOpen(true);
    handleModalOpen();
  };
  const handleFilterInventory = (value) => {
    if (value !== '') {
      setLoading(true);

      axiosInstance
        .get(`/pastinv/inv/view/all/${value}`, {
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

          console.log(err);
        });
    }
  };
  return (
    <>
      <Modal open={modalOpen} onClose={handleModalClose}>
        {editdetailsOpen ? (
          <EditOldInv
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
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
            url={'/pastinv/inv/delete'}
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
        <p>View All Market credits</p>
      </div>
      <div className="page__pcont">
        {!user.is_distributor && !user.is_salesref ? (
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
                actions={[
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
                        (user.is_distributor ||
                          user.is_manager ||
                          user.is_excecutive) ? (
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
                        (user.is_manager || user.is_excecutive) ? (
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
    </>
  );
};

export default ViewOldInvoice;
