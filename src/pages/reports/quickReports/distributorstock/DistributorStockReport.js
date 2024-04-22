import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { axiosInstance } from '../../../../axiosInstance';
import ExcelFileDownload from '../../../../components/fileDownload/ExcelFileDownload';
import Spinner from '../../../../components/loadingSpinner/Spinner';
import { Modal } from '@mui/material';


const ShowMessage = forwardRef((props, ref) => {
    return (
        <ExcelFileDownload
            hide={props.handleClose}
            success={props.success}
            error={props.error}
            title={props.title}
            msg={props.msg}
            file={props.file}
            file_name={props.file_name}

            ref={ref}
        />
    );
});



const DistributorStockReport = (props) => {
    const inputRef = useRef(null);
    const [dateBy, setDateBy] = useState({
        date_from: '',
        date_to: '',
        status: 'confirmed',
        sales_ref: '',
        distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [loading, setLoading] = useState(false);

    const [distributors, setDistributors] = useState([]);
    const [salesrefs, setSalesrefs] = useState([]);

    const [file, setFile] = useState(null)
    const [file_name, setFileName] = useState('')
    useEffect(() => {
        if (props.user.is_manager) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/manager/${props.user.id}`, {
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
                    console.log(err);
                });


        }
        if (props.user.is_company) {
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
                    console.log(err);
                });


        }
        if (props.user.is_excecutive) {
            setLoading(true);
            axiosInstance
                .get(`/users/distributors/by/executive/${props.user.id}`, {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    setLoading(false);

                    setSalesrefs(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (props.user.is_distributor) {
            axiosInstance.get(`/distributor/salesrefs/${props.user_details.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
                .then((res) => {
                    setSalesrefs(res.data);
                }).catch((err) => {
                    console.log(err);
                });
        }

    }, []);

    const handleDistributor = (e) => {
        setDateBy({
            ...dateBy,
            distributor: e.target.value,
        });

        axiosInstance.get(`/distributor/salesrefs/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {
                setSalesrefs(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };
    const handleDateByFilter = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        setSuccess(false);
        axiosInstance
            .post(`/reports/stockdetails/get/by/date/`, dateBy, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
                timeout: 50000,
                responseType: 'blob',
            })
            .then((res) => {
                setLoading(false);
                setFile(res.data)
                setError(false);
                setSuccess(true);
                setFileName(`stock_report_${dateBy.date_to}`)
                setTitle('Your file is ready');
                setMsg('Click download button to download');
                handleOpen();
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                setSuccess(false);
                setError(true);

                setTitle('Error');
                setMsg('Something went wrong. Please try again.');
                handleOpen();
            });

    };


    return (
        <>
            {loading ? (
                <div className="page-spinner">
                    <div className="page-spinner__back">
                        <Spinner detail={true} />
                    </div>
                </div>
            ) : (
                ''
            )}
            {
                <Modal open={open} onClose={handleClose}>
                    <ShowMessage
                        ref={inputRef}
                        handleClose={handleClose}
                        success={success}
                        error={error}
                        title={title}
                        msg={msg}
                        file_name={file_name}
                        file={file}
                    />
                </Modal>
            }
            <div className="page__title">
                <p>Distributor Stock Report</p>
            </div>
            <div className="page__pcont">

                <div className="form">
                    <div className="form__row">
                        {props.user.is_manager ||
                            props.user.is_company ||
                            props.user.is_excecutive ? (
                            <div className="form__row__col">
                                <div className="form__row__col__label">Distributor</div>
                                <div className="form__row__col__input">
                                    <select
                                        name=""
                                        id=""
                                        defaultValue={'1'}
                                        onChange={(e) => handleDistributor(e)}
                                    >
                                        <option value="">Select Distributor</option>
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

                        <div className="form__row__col">
                            <div className="form__row__col__label">Start Date</div>
                            <div className="form__row__col__input">
                                <input
                                    type="date"
                                    onChange={(e) =>
                                        setDateBy({ ...dateBy, date_from: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form__row__col">
                            <div className="form__row__col__label">End Date</div>
                            <div className="form__row__col__input">
                                <input
                                    type="date"
                                    onChange={(e) =>
                                        setDateBy({ ...dateBy, date_to: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form__row__col dontdisp"></div>

                        {/* {
                            !props.user.is_salesref ? (
                                <div className="form__row__col">
                                    <div className="form__row__col__label">Sales ref</div>
                                    <div className="form__row__col__input">
                                        <select name="" id="" onChange={(e) =>
                                            setDateBy({ ...dateBy, sales_ref: e.target.value })}>

                                            <option value="">Select sales rep</option>

                                            {
                                                salesrefs.map((item, i) => (<option value={item.salesref_id} key={i}>{item.full_name}</option>))
                                            }

                                        </select>
                                    </div>
                                </div>
                            ) : ''
                        } */}
                        <div
                            className="form__row__col dontdisp"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <button
                                className="btnEdit"
                                onClick={(e) => handleDateByFilter(e)}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ >
    )
}

export default DistributorStockReport