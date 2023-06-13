import { axiosInstance } from '../../../axiosInstance';
import React, { useEffect, useState, forwardRef, use } from 'react';

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
import RequsetStatus from '../../../components/requeststatus/RequsetStatus';

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

const EditBill = (props) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timeout, setTimeout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [data, setData] = useState({
    qty: 0,
    foc: 0,
    discount: 0,
  });
  const [items, setItems] = useState([]);
  const columns = [
    {
      title: 'ID',
      field: 'id',
      cellStyle: { width: '10px' },
      width: '10px',
      headerStyle: { width: '10px' },
      editable: false,
    },
    { title: 'Bill ', field: 'code', editable: false },
    { title: 'Date', field: 'date', editable: false },
    { title: 'Due date', field: 'due_date', editable: false },
    { title: 'Payment type', field: 'payment_type' },
    { title: 'Amount', field: 'paid_amount' },
    { title: 'Added by', field: 'added_by' },
  ];

  useEffect(() => {
    axiosInstance
      .get(`/salesref/invoice/all/invoice/payments/${props.invoice.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [success, setSuccess]);
  console.log(props);
  const handleClose = (e) => {
    e.preventDefault();
    props.showEdit(false);
    props.closeModal();
  };
  return (
    <div className="edit_details">
      <div className="container">
        <div className="title">
          <h1>Payment history</h1>
        </div>
        <div className="details">
          <section className="twosides">
            <div>
              <div className="subtitle">
                <p>Invoice created by</p>
              </div>
              <div className="info">
                <p>{props.invoice.added_by}</p>
              </div>
            </div>
            <div>
              <div className="subtitle">
                <p>Dealer</p>
              </div>
              <div className="info">
                <p>{props.invoice.dealer_name}</p>
                <p>{props.invoice.dealer_address}</p>
                <p>{props.invoice.contact_number}</p>
              </div>
            </div>
          </section>
          <RequsetStatus
            loading={loading}
            error={error}
            setSuccess={setSuccess}
            setError={setError}
            success={success}
            successMsg={successMsg}
            errorMsg={errorMsg}
            timeout={timeout}
          />

          <section>
            <MaterialTable
              title="All payments that included in related bill"
              columns={columns}
              data={items}
              icons={tableIcons}
            />
          </section>
        </div>
        <div className="buttoncontainer">
          <button className="btnDelete" onClick={(e) => handleClose(e)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBill;
