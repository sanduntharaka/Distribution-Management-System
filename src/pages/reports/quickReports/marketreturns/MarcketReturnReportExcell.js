import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { utils, writeFile } from 'xlsx';

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



const MarcketReturnReportExcell = (props) => {
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

    const distributors = props.distributors;
    const [salesrefs, setSalesrefs] = useState(props.salesrefs);

    const [file, setFile] = useState(null)
    const [file_name, setFileName] = useState('')
    useEffect(() => {
        // Update the state when props change
        setSalesrefs(props.salesrefs);
    }, [props.salesrefs]);
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
            .post(`/reports/mkreturns/get/by/date/`, dateBy, {
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
                setFileName(`marketreturn_${dateBy.date_to}`)
                setTitle('Your file is ready');
                setMsg('Click download button to download');
                handleOpen();
            })
            .catch((err) => {
                setLoading(false);
                console.log(err.request.statusTex);
                setSuccess(false);
                setError(true);

                setTitle('Error');
                setMsg(`Data ${err.request.statusText}. Please try again.`);
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
                <p>Market returns report</p>
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

                        {
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
                        }
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

export default MarcketReturnReportExcell