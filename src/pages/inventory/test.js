import { forwardRef, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
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

import RequsetStatus from '../../../components/requsetstatus/RequsetStatus';
import axios from 'axios';

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

const DEpartmentTable = () => {
  var columns = [
    { title: 'Id', field: 'id' },
    { title: 'Department Name', field: 'department_name' },
    { title: 'Project_id', field: 'project_id', hidden: true },
    { title: 'Project', field: 'project' },
    { title: 'Branch_id', field: 'branch_id', hidden: true },
    { title: 'Branch', field: 'branch' },
  ];
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [data, setData] = useState([]);
  const [timeout, setTimeout] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/hrm/department/get/')
      .then((res) => {
        setData(res.data);
        setLoading(false);
        setSuccess(true);
        setTimeout(true);
        setSuccessMsg('Data loading completed');
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setError(true);
        setTimeout(true);
        setErrorMsg('Error! Server not responded');
      })
      .finally(setLoading(false));
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = [];
    if (newData.department_name === '') {
      errorList.push('Please enter department name');
    }
    if (newData.project === '') {
      errorList.push('Please enter project name');
    }
    if (newData.branch === '') {
      errorList.push('Please enter branch number');
    }

    if (errorList.length < 1) {
      setLoading(true);
      axios
        .put(`/hrm/department/update/${newData.id}`, newData)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setLoading(false);
          setSuccess(true);
          setTimeout(true);
          setSuccessMsg('Data updated successfully');
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          setTimeout(true);
          setErrorMsg('Server error!, Please try again');
          resolve();
        })
        .finally(setLoading(false));
    } else {
      setErrorMsg('Error, Try again');
      setError(true);
      resolve();
      setTimeout(true);
    }
  };
  const handleRowDelete = (oldData, resolve) => {
    setLoading(true);
    axios
      .delete(`/hrm/department/delete/${oldData.id}`)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
        setLoading(false);
        setSuccess(true);
        setTimeout(true);
        setSuccessMsg('Data deleted successfully');
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setTimeout(true);
        setErrorMsg('Delete failed! Server error');
        resolve();
      })
      .finally(setLoading(false));
  };
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={0}></Grid>
        <Grid item xs={15}>
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
            title="All Departments Saved in Database"
            columns={columns}
            data={data}
            icons={tableIcons}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);
                }),

              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve);
                }),
            }}
          />
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </>
  );
};

export default DEpartmentTable;
