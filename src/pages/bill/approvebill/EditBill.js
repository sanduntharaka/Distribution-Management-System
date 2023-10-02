// import React, { useEffect, useState } from 'react';
// import { AiFillEdit, AiFillSave, AiFillDelete } from 'react-icons/ai';
import { axiosInstance } from '../../../axiosInstance';
import React, { useEffect, useState, forwardRef, use } from 'react';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
// import Message from '../../components/message/Message';
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
import { Delete } from '@material-ui/icons';
import EditInvoiceItems from '../../../components/edit/EditInvoiceItems';

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

  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    { title: 'Bill ', field: 'bill_code', editable: false },
    { title: 'Item code', field: 'item_code', editable: false },
    { title: 'Description', field: 'description', editable: false },
    { title: 'Qty', field: 'qty' },
    { title: 'Foc', field: 'foc' },
    { title: 'Discount', field: 'discount' },
    { title: 'Sub Total', field: 'extended_price' },
  ];

  useEffect(() => {
    axiosInstance
      .get(`/salesref/invoice/items/${props.invoice.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [success, setSuccess]);

  const [selected, setSelected] = useState();
  const handleEdit = (e, rowData) => {
    e.preventDefault();
    setSelected(rowData);
    handleOpen();
  };

  const handleDelete = (oldData, resolve) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    console.log(oldData)
    axiosInstance
      .delete(`/salesref/invoice/item/delete/`, { id: 'abc' }, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setLoading(false);
        setTimeout(true);
        setSuccessMsg('Data deleted successfully');
        resolve();
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTimeout(true);
        setErrorMsg('Server error!, Please try again');

        resolve();
      });
  };

  const handleClosePopUp = (e) => {
    e.preventDefault();
    props.msgSuccess(true);
    props.showEdit(false);
    props.closeModal();

    window.location.reload();
  };
  return (
    <div className="edit_details">
      <Modal open={open} onClose={handleClose}>
        <EditInvoiceItems
          handleClose={handleClose}
          selected={selected}
          setloading={setLoading}
          setsuccess={setSuccess}
          seterror={setError}
          settimeout={setTimeout}
          setsuccessmsg={setSuccessMsg}
          seterrormsg={setErrorMsg}
        />
      </Modal>
      <div className="container">
        <div className="title">
          <h1>Edit bill</h1>
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

          <section className="table">
            <MaterialTable
              title="All items that included in related bill"
              columns={columns}
              data={items}
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
                  icon: Edit,
                  tooltip: 'Edit',
                  onClick: (event, rowData) => handleEdit(event, rowData),
                },
                // {
                //   icon: Delete,
                //   tooltip: 'Delete',
                //   onClick: (event, rowData) => handleDelete(event, rowData),
                // },
              ]}
              components={{
                Action: (props) => (
                  <React.Fragment>
                    {props.action.icon === Edit ? (
                      <IconButton
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                        color="primary"
                        style={{ color: 'orange' }} // customize the icon color
                        size="small"
                        aria-label={props.action.tooltip}
                      >
                        <Edit />
                      </IconButton>
                    )
                      // : props.action.icon === Delete ? (
                      //   <IconButton
                      //     onClick={(event) =>
                      //       props.action.onClick(event, props.data)
                      //     }
                      //     color="primary"
                      //     style={{ color: 'red' }} // customize the icon color
                      //     size="small"
                      //     aria-label={props.action.tooltip}
                      //   >
                      //     <Delete />
                      //   </IconButton>
                      // ) 
                      : (
                        ''
                      )}
                  </React.Fragment>
                ),
              }}
            />
          </section>
        </div>
        <div className="buttoncontainer">
          <button className="btnDelete" onClick={(e) => handleClosePopUp(e)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBill;
