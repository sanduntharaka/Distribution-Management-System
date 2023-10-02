import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
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


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => (
        <Check {...props} ref={ref} style={{ color: 'blue' }} />
    )),
    Clear: forwardRef((props, ref) => (
        <Clear {...props} ref={ref} style={{ color: 'red' }} />
    )),
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

const ViewTargets = (props) => {
    const [distributorData, setDistributorData] = useState([]);
    const [salesrepData, setSalesrepData] = useState([]);


    const [tblData, setTableData] = useState([]);
    const columns_distributor = [
        {
            title: 'ID',
            field: 'id',
            cellStyle: { width: '10px' },
            width: '10px',
            headerStyle: { width: '10px' },
            editable: false,
        },
        { title: 'Distributor Name', field: 'distributor_name', editable: false, },

        { title: 'Category Name', field: 'category_name', editable: false, },
        { title: 'Date From', field: 'date_form' },
        { title: 'Date To', field: 'date_to' },
        { title: 'Amount(Rs)', field: 'amount' },
    ];
    const columns_salesrep = [
        {
            title: 'ID',
            field: 'id',
            cellStyle: { width: '10px' },
            width: '10px',
            headerStyle: { width: '10px' },
            editable: false,
        },
        { title: 'Salesrep Name', field: 'salesrep_name', editable: false, },

        { title: 'Category Name', field: 'category_name', editable: false, },
        { title: 'Date From', field: 'date_form' },
        { title: 'Date To', field: 'date_to' },
        { title: 'Amount(Rs)', field: 'amount' },
    ];





    //modal
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    //item_codes
    const [itemCodes, setItemCodes] = useState([]);

    //mesage show

    const [disLoading, setDisLoading] = useState(false);
    const [srepLoading, setSrepLoading] = useState(false);

    const [messageOpen, setMessageOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setDisLoading(true);
        axiosInstance
            .get(`/target/show-distributor/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setDisLoading(false);
                setDistributorData(res.data);

            })
            .catch((err) => {
                setDisLoading(false);
                console.log(err);
            });
        setSrepLoading(true)
        axiosInstance
            .get(`/target/show-salesrep/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setSrepLoading(false);
                setSalesrepData(res.data);

            })
            .catch((err) => {
                setSrepLoading(false);
                console.log(err);
            });
    }, [success, props.success]);

    const handleEditDistributor = (newData, oldData, resolve) => {
        setDisLoading(true);
        setError(false);
        setSuccess(false);
        console.log(newData)
        axiosInstance
            .put(`/target/edit-distributor/${newData.id}`, newData, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setDisLoading(false);
                setError(false);
                setSuccess(true);
                setTitle('Success');
                setMsg('Target has been updated successfully');
                handleModalOpen();
                resolve();
            })
            .catch((error) => {
                setDisLoading(false);
                setSuccess(false);
                setError(true);
                setTitle('Error');

                setMsg('Server error!, Please try again');
                handleModalOpen();
                resolve();
            });
    };
    const handleDeleteDistributor = (oldData, resolve) => {
        setDisLoading(true);
        setError(false);
        setSuccess(false);
        axiosInstance
            .delete(`/target/delete-distributor/${oldData.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setDisLoading(false);

                setError(false);
                setSuccess(true);
                setTitle('Success');
                setMsg('Target has been deleted successfully');
                handleModalOpen();
                resolve();
            })
            .catch((error) => {
                setDisLoading(false);
                setSuccess(false);
                setError(true);
                setTitle('Error');

                setMsg('Server error!, Please try again');
                handleModalOpen();
                resolve();
            });
    };

    const handleEditSalesrep = (newData, oldData, resolve) => {
        setSrepLoading(true);
        setError(false);
        setSuccess(false);
        axiosInstance
            .put(`/target/edit-salesrep/${newData.id}`, newData, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setSrepLoading(false);
                setError(false);
                setSuccess(true);
                setTitle('Success');
                setMsg('Target has been updated successfully');
                handleModalOpen();
                resolve();
            })
            .catch((error) => {
                setSrepLoading(false);
                setSuccess(false);
                setError(true);
                setTitle('Error');

                setMsg('Server error!, Please try again');
                handleModalOpen();
                resolve();
            });
    };
    const handleDeleteSalesrep = (oldData, resolve) => {
        setSrepLoading(true);
        setError(false);
        setSuccess(false);
        axiosInstance
            .delete(`/target/delete-salesrep/${oldData.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setSrepLoading(false);

                setError(false);
                setSuccess(true);
                setTitle('Success');
                setMsg('Target has been deleted successfully');
                handleModalOpen();
                resolve();
            })
            .catch((error) => {
                setSrepLoading(false);
                setSuccess(false);
                setError(true);
                setTitle('Error');

                setMsg('Server error!, Please try again');
                handleModalOpen();
                resolve();
            });
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
                <p>View all Distributor Targets</p>
            </div>
            <div className="page__pcont">
                <div className="page__pcont__row">
                    <div className="page__pcont__row__col">
                        <div className="dataTable">
                            <MaterialTable
                                isLoading={disLoading}
                                title={false}
                                columns={columns_distributor}
                                data={distributorData}
                                icons={tableIcons}
                                editable={
                                    props.user.is_manager || props.user.is_company
                                        ? {
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise((resolve) => {
                                                    handleEditDistributor(newData, oldData, resolve);
                                                }),

                                            onRowDelete: (oldData) =>
                                                new Promise((resolve) => {
                                                    handleDeleteDistributor(oldData, resolve);
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

            <div className="page__title">
                <p>View Salesrep Targets</p>
            </div>
            <div className="page__pcont">
                <div className="page__pcont__row">
                    <div className="page__pcont__row__col">
                        <div className="dataTable">
                            <MaterialTable
                                isLoading={srepLoading}
                                title={false}
                                columns={columns_salesrep}
                                data={salesrepData}
                                icons={tableIcons}
                                editable={
                                    props.user.is_manager || props.user.is_company
                                        ? {
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise((resolve) => {
                                                    handleEditSalesrep(newData, oldData, resolve);
                                                }),

                                            onRowDelete: (oldData) =>
                                                new Promise((resolve) => {
                                                    handleDeleteSalesrep(oldData, resolve);
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

export default ViewTargets