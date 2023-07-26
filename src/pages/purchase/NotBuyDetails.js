import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import ProductDetails from '../inventory/componets/ProductDetails';
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
import EditIcon from '@mui/icons-material/Edit';
import EditNotBuy from '../../components/edit/EditNotBuy';
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
const NotBuyDetails = ({ user, userdetail }) => {
  const [tblData, setTableData] = useState([]);

  const columns = [
    {
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    { title: 'Dealer', field: 'dealer_name' },
    { title: 'Date', field: 'datetime' },
    { title: 'Added by', field: 'added_name' },
    {
      title: 'Reason',
      render: (rowData) => {
        let reson1 = '';
        let reson2 = '';
        let reson3 = '';
        let reson4 = '';

        if (rowData.is_only_our) {
          reson1 = 'Have only our goods. ';
        }
        if (rowData.is_competitor) {
          reson2 = 'Have competitor goods. ';
        }
        if (rowData.is_payment_problem) {
          reson3 = 'payment problem.  ';
        }
        if (rowData.is_dealer_not_in) {
          reson4 = 'Dealer not in.  ';
        }
        return `${reson1}${reson2}${reson3}${reson4}`;
      },
    },
  ];

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [salesrefs, setSalesrefs] = useState([]);

  //details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState();

  //edit-details
  const [editdetailsOpen, setEditDetailsOpen] = useState(false);

  //delete-details
  const [deletedetailsOpen, setDeleteDetailsOpen] = useState(false);

  //mesage show
  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [distributors, setDistributors] = useState([]);

  // useEffect(() => {
  //   if (selected_distributor !== undefined) {
  //     handleFilterInventory(selected_distributor);
  //   }
  // }, [success]);

  useEffect(() => {
    if (user.is_manager) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/manager/${userdetail.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    } else if (user.is_excecutive) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/executive/${userdetail.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
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

          console.log('d:', res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    } else if (user.is_distributor) {
      // handleFilterInventory(user.id);
      axiosInstance
        .get(`/distributor/salesrefs/${userdetail.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setSalesrefs(res.data);
        });
    } else if (user.is_salesref) {
      axiosInstance
        .get(`/not-buy/get/salesref/${userdetail.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [success]);

  const handleEditDetails = (e, value) => {
    setItemDetails({
      id: value.id,
      dealer: value.dealer,
      date: value.date,
      is_only_our: value.is_only_our,
      is_competitor: value.is_competitor,
      is_payment_problem: value.is_payment_problem,
      is_dealer_not_in: value.is_dealer_not_in,
      added_by: value.added_by,
      dealer_name: value.dealer_name,
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
      dealer: value.dealer,
      date: value.date,
      is_only_our: value.is_only_our,
      is_competitor: value.is_competitor,
      is_payment_problem: value.is_payment_problem,
      is_dealer_not_in: value.is_dealer_not_in,
      added_by: value.added_by,
      dealer_name: value.dealer_name,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(true);
    handleModalOpen();
  };
  const [filterBy, setFilterBy] = useState({
    distributor: userdetail.id,
    salesref: -1,
  });
  const handleFilterSalesrefs = (value) => {
    setFilterBy({ ...filterBy, distributor: value });
    if (value !== '') {
      setLoading(true);

      axiosInstance
        .get(`/distributor/salesrefs/${value}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setSalesrefs(res.data);
          setLoading(false);
        });
    }
  };

  const handleFilterBySalesref = (e) => {
    setFilterBy({ ...filterBy, salesref: e.target.value });
    setTableData([]);
  };

  const handleFilter = (e) => {
    axiosInstance
      .post(`/not-buy/get/filter/`, filterBy, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log('dd:', res.data);
        setTableData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setTableData([]);
      });
  };
  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <ProductDetails
            data={itemDetails}
            showDetails={setDetailsOpen}
            showEdit={setEditDetailsOpen}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
          />
        ) : editdetailsOpen ? (
          <EditNotBuy
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
            url={'/not-buy/edit'}
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
            url={'/not-buy/delete'}
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
        <p>View All none-buy details</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row">
          {!user.is_salesref && !user.is_distributor ? (
            <div className="form__row__col">
              <div className="form__row__col__label">Distributor</div>
              <div className="form__row__col__input">
                <select
                  defaultValue={''}
                  onChange={(e) => handleFilterSalesrefs(e.target.value)}
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
          ) : (
            ''
          )}
          {!user.is_salesref ? (
            <>
              <div className="form__row__col">
                <div className="form__row__col__label">Salesrefs</div>
                <div className="form__row__col__input">
                  <select
                    name=""
                    id=""
                    defaultValue={'-1'}
                    onChange={(e) => handleFilterBySalesref(e)}
                  >
                    <option value="-1">All</option>
                    {salesrefs.map((item, i) => (
                      <option value={item.salesref_id} key={i}>
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
                <button className="btnEdit" onClick={(e) => handleFilter(e)}>
                  Filter
                </button>
              </div>
            </>
          ) : (
            ''
          )}
          <div className="form__row__col dontdisp"></div>
          <div className="form__row__col dontdisp"></div>
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
                      {props.action.icon === EditIcon &&
                      (user.is_company || user.is_manager) ? (
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
                        (user.is_company || user.is_manager) ? (
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
    </div>
  );
};

export default NotBuyDetails;
