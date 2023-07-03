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
import { FormControl, Select, MenuItem } from '@material-ui/core';
import RequsetStatus from '../../../components/requeststatus/RequsetStatus';

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

const DetailsItems = (props) => {
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
      title: '#',
      field: 'rowIndex',
      render: (rowData) => rowData?.tableData?.id + 1,
      editable: false,
    },
    { title: 'Date', field: 'date', editable: false },
    { title: 'Invoice no', field: 'invoice_number' },
    { title: 'Qty', field: 'qty' },
    { title: 'Foc', field: 'foc' },
    { title: 'Pack size', field: 'pack_size' },
    { title: 'Whole sale price', field: 'whole_sale_price' },
    { title: 'Retails price', field: 'retail_price' },
    {
      title: 'From',
      field: 'from_sales_return',
      render: (rowData) =>
        rowData.from_sales_return ? 'Sales return' : 'Company',
      editComponent: (props) => (
        <FormControl>
          <Select
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          >
            <MenuItem value={false}>Company</MenuItem>
            <MenuItem value={true}>Sales return</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/distributor/items/all/${props.invoice.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [success, setSuccess]);

  const handleEdit = (newData, oldData, resolve) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    console.log(newData);
    axiosInstance
      .put(`/distributor/stoks/edit/${newData.id}`, newData, {
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
        setSuccessMsg('Data updated successfully');
        resolve();
        props.success(true);
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

  const handleDelete = (oldData, resolve) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .delete(`/distributor/stoks/delete/${oldData.id}`, {
        data: oldData,
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
        props.success(true);
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
  return (
    <section>
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
      <MaterialTable
        title="All stocks that included in related item code"
        columns={columns}
        data={items}
        icons={tableIcons}
        isLoading={loading}
        editable={
          props.user.is_distributor
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
    </section>
  );
};

export default DetailsItems;
