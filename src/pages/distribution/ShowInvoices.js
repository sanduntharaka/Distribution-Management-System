import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import ProductDetails from '../inventory/componets/ProductDetails';
import ProductEdit from '../inventory/componets/ProductEdit';
import ProductDelete from '../inventory/componets/ProductDelete';
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
import Invoice from '../../components/invoice/Invoice';
import HandleDeleteCompanyInvoice from '../../components/userComfirm/HandleDeleteCompanyInvoice';

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
const ShowInvoices = () => {
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
    { title: 'Invoice', field: 'invoice_code' },
    { title: 'Date', field: 'date' },
    { title: 'Buyer', field: 'solled_name' },
    { title: 'Issued Buy', field: 'isssued_name' },
  ];
  const [items, setItems] = useState([]);
  const [distributor, setDistributor] = useState({ user: '' });
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
      .get('/company/invoice/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [success]);
  const [inv, setInv] = useState({
    invoice_code: '',
    invoice_number: '',
    date: '',
  });
  const handleViewDetails = (e, value) => {
    e.preventDefault();
    console.log(value);
    setItemDetails({
      id: value.id,
      date: value.date,
      invoice_code: value.invoice_code,
      invoice_number: value.invoice_number,
      isssued_name: value.isssued_name,
      issued_by: value.issued_by,
      solled_name: value.solled_name,
      solled_to: value.solled_to,
    });
    setInv({
      invoice_code: value.invoice_code,
      invoice_number: value.invoice_number,
      date: value.date,
    });
    setDistributor({
      user: value.solled_to,
    });
    axiosInstance
      .get(`/company/invoice/items/${value.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        res.data.map((item, i) =>
          items.push({
            item_code: item.item,
            description: item.description,
            qty: item.qty,
            whole_sale_price: item.unit_price,
          })
        );
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
      id: value.id,
    });
    setMessageOpen(false);
    setDetailsOpen(false);
    setEditDetailsOpen(false);
    setDeleteDetailsOpen(true);
    handleModalOpen();
  };

  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <Invoice
        distributor={props.distributor}
        items={props.items}
        inv={props.inv}
      />
    );
  });
  // <Modal open={showinv} onClose={() => handleCloseInv()}>
  //       <MyInvoice distributor={distributor} items={items} oldinv={true} />
  //     </Modal>
  return (
    <div className="page">
      <Modal open={modalOpen} onClose={handleModalClose}>
        {detailsOpen ? (
          <MyInvoice
            distributor={distributor}
            items={items}
            oldinv={true}
            inv={inv}
          />
        ) : deletedetailsOpen ? (
          <HandleDeleteCompanyInvoice
            data={itemDetails}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showConfirm={setDeleteDetailsOpen}
            closeModal={handleModalClose}
            url={'/company/invoice/delete'}
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
        <p>View All Issued Bills</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            {/* <div>
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
            </div> */}
          </div>
          <div className="page__pcont__row__col">
            {/* <div>
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
            </div> */}
          </div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
          <div className="page__pcont__row__col dontdisp"></div>
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

export default ShowInvoices;
