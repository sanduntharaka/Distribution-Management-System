import React, { useEffect, useState, forwardRef } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import { formatNumberPrice } from '../../var/NumberFormats';
import Modal from '@mui/material/Modal';

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

const MyMessage = React.forwardRef((props, ref) => {
    return (
        <Message
            hide={() => props.handleClose()}
            success={props.success}
            error={props.error}
            title={props.title}
            msg={props.msg}
            ref={ref}
        />
    );
});


const DailyTargets = () => {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const columns = [
        {
            title: '#',
            field: 'rowIndex',
            render: (rowData) => rowData?.tableData?.id + 1,
        },
        { title: 'PSA', field: 'psa', editable: false, },

        { title: 'Target', field: 'value', editable: false, render: (rowData) => formatNumberPrice(rowData.value), },
        { title: 'Achieved', field: 'covered', render: (rowData) => formatNumberPrice(rowData.covered), },
    ];



    const [salesrefs, setSalesrefs] = useState([]);
    const [salesref, setSalesref] = useState('');

    useEffect(() => {

        axiosInstance
            .get(`/users/salesrefs/by/manager/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setSalesrefs(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    const handleDate = (e) => {
        if (salesref == '') {
            setError(true)
            setMsg("You must select a sales rep")
            setTitle("Error")
            handleOpen()
        } else {
            setIsLoading(true)
            axiosInstance.
                post(
                    `/target/view-daily-value/`,
                    {
                        salesref: salesref,
                        date: e.target.value

                    },

                    {
                        headers: {
                            Authorization:
                                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                        },
                    }
                )
                .then((res) => {
                    setIsLoading(false)
                    setData(res.data);
                })
                .catch((err) => {
                    setIsLoading(false)
                    console.log(err);
                });
        }
    }

    return (
        <div className="page">
            <Modal open={open} onClose={handleClose}>
                <MyMessage
                    handleClose={handleClose}
                    success={success}
                    error={error}
                    title={title}
                    msg={msg}
                />
            </Modal>
            <div className="page__title">
                <p>View all Sales Rep Daily Value Targets</p>
            </div>
            <div className="page__pcont">
                <div className="page__pcont__row" style={{ background: "#cccccc" }}>
                    <div className="page__pcont__row__col">
                        <div className="form__row__col__label">Select Sales Rep</div>
                        <div className="form__row__col__input">
                            <select name="salesref" id="" onChange={(e) => setSalesref(e.target.value)}>
                                <option value="">Select Sales Rep</option>
                                {
                                    salesrefs.map((item, i) => (
                                        <option value={item.id} key={i}>{item.full_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="page__pcont__row__col">
                        <div className="form__row__col__label">Select Date</div>
                        <div className="form__row__col__input">
                            <input type="date" name='date' onChange={(e) => handleDate(e)} />
                        </div>
                    </div>

                </div>
                <div className="page__pcont__row">
                    <div className="page__pcont__row__col">
                        <div className="dataTable">
                            <MaterialTable
                                isLoading={isLoading}
                                title={false}
                                columns={columns}
                                data={data}
                                icons={tableIcons}
                                options={{
                                    exportButton: true,
                                    actionsColumnIndex: 0,
                                    pageSize: 50,
                                    pageSizeOptions: [50, 75, 100],
                                    rowStyle: (rowData) => (rowData.value <= rowData.covered ? { backgroundColor: '#03ceff' } : '')

                                }
                                }

                            />
                            {/* </section> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DailyTargets