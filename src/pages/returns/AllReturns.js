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
import DetailsReturn from '../../components/details/DetailsReturn';
import ReturnDelete from '../../components/userComfirm/ReturnDelete';
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

const AllReturns = () => {
  const [data, setData] = useState([]);
  const [tblData, setTableData] = useState([]);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      cellStyle: { width: '10px' },
      width: '10px',
      headerStyle: { width: '10px' },
    },
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
        `/salesref/return/get/${
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
          if (!sales_refs.includes(item.added_email)) {
            sales_refs.push(item.added_email);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, ['']);

  const handleViewDetails = (e, value) => {
    e.preventDefault();
    axiosInstance
      .get(`/salesref/return/get/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItemDetails({
          added_email: value.added_email,
          id: value.id,
          date: value.date,
          psa_name: value.psa_name,
          dealer_name: value.dealer_name,
          is_return_goods: value.is_return_goods,
          is_deduct_bill: value.is_deduct_bill,
          bill_code: value.bill_code,
          bill_number: value.bill_number,
          amount: value.amount,
        });
        setReturnItems(res.data);
        setMessageOpen(false);
        setEditDetailsOpen(false);
        setDeleteDetailsOpen(false);
        setDetailsOpen(true);

        handleModalOpen();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteDetails = (e, value) => {
    setItemDetails({
      added_email: value.added_email,
      id: value.id,
      date: value.date,
      psa_name: value.psa_name,
      dealer_name: value.dealer_name,
      is_return_goods: value.is_return_goods,
      is_deduct_bill: value.is_deduct_bill,
      bill_code: value.bill_code,
      bill_number: value.bill_number,
      amount: value.amount,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(true);
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
      let filteredItems = data.filter((item) => item.added_email === i);
      console.log(filteredItems);
      setTableData(filteredItems);
    }
  };

  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <DetailsReturn
            data={itemDetails}
            items={returnItems}
            showDetails={setDetailsOpen}
            showEdit={setEditDetailsOpen}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
          />
        ) : deletedetailsOpen ? (
          <ReturnDelete
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            url={'/salesref/return/delete'}
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
        <p>View All Issued Market Returns</p>
      </div>
      <div className="page__pcont">
        {/* <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div>
              <select name="" id="">
                <option value="" selected>
                  select
                </option>
                {sales_refs.map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="page__pcont__row__col">
            <div>
              <select name="" id="">
                <option value="" selected>
                  select
                </option>
                {distributors.map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
        </div> */}
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
                      ) : (
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
export default AllReturns;
