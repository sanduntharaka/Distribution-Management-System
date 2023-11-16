import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { axiosInstance } from '../../../../axiosInstance';
import ExcelFileDownload from '../../../../components/fileDownload/ExcelFileDownload';
import Spinner from '../../../../components/loadingSpinner/Spinner';
import { Modal } from '@mui/material';
import SearchSpinner from '../../../../components/loadingSpinner/SearchSpinner';
import SearchIcon from '@mui/icons-material/Search';

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



const RetailerPerformanceReport = (props) => {
    const inputRef = useRef(null);
    const [dateBy, setDateBy] = useState({
        date_from: '',
        date_to: '',
        status: 'confirmed',
        dealer: '',
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

    const [showDealers, setShowDealers] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectDealer, setSelectDealer] = useState(false)
    const [valuedealer, setValueDealer] = useState('');
    const [dealers, setDealers] = useState([]);

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
                // setSalesrefs(res.data);
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
            .post(`/reports/delaerdetails/performance/`, dateBy, {
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
                setFileName(`retailer_performance`)
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

    const filterDealers = (e) => {
        setShowDealers(true);
        setSearchLoading(true);
        setSelectDealer(false)
        axiosInstance
            .get(`/dealer/all/search?search=${e.target.value}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setSearchLoading(false);

                setDealers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        setValueDealer(e.target.value);
    };

    const handleSelectDealer = (e, item) => {
        setValueDealer(item.name);

        setDateBy({
            ...dateBy,
            dealer: item.id,
        });
        setShowDealers(false);
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
                <p>Retailer Performance report</p>
            </div>
            <div className="page__pcont">

                <div className="form">
                    <div className="form__row">
                        {/* {props.user.is_manager ||
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
                        )} */}

                        <div className="form__row__col">
                            <div className="form__row__col__label">Select Dealer</div>
                            <div className="form__row__col__input">
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <input
                                        className={selectDealer ? 'err' : ''}
                                        type="text"
                                        placeholder="Search..."
                                        value={valuedealer}
                                        onChange={(e) => filterDealers(e)}
                                    />
                                    {searchLoading ? (
                                        <div
                                            style={{
                                                padding: '5px',
                                                position: 'absolute',
                                                right: 0,
                                                top: '-2px',
                                                bottom: 0,
                                            }}
                                        >
                                            <SearchSpinner search={true} />
                                        </div>
                                    ) : (
                                        <SearchIcon
                                            style={{
                                                padding: '5px',
                                                position: 'absolute',
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                            }}
                                        />
                                    )}
                                </div>
                                <div
                                    className="searchContent"
                                    style={
                                        !showDealers ? { display: 'none' } : { display: 'grid' }
                                    }
                                >
                                    <div className="searchContent__row">
                                        <div className="searchContent__row__details">
                                            <p>Name</p>
                                            <p>Address</p>
                                        </div>
                                    </div>
                                    {dealers
                                        .filter((item) => {
                                            const searchTerm = valuedealer.toLowerCase();
                                            const name = item.name.toLowerCase();
                                            const address = item.address.toLowerCase();
                                            return (
                                                (name.includes(searchTerm) && name !== searchTerm) ||
                                                (address.includes(searchTerm) &&
                                                    address !== searchTerm)
                                            );
                                        })
                                        .map((item, i) => (
                                            <div
                                                className="searchContent__row"
                                                onClick={(e) => handleSelectDealer(e, item)}
                                                key={i}
                                            >
                                                <div className="searchContent__row__details">
                                                    <p>{item.name}</p>
                                                    <p>{item.address}</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                {selectDealer ? (
                                    <div className="form__row__col__error">
                                        <p>Please select the dealer</p>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        {
                            !props.user.is_distributor ? (
                                <div className="form__row__col dontdisp"></div>
                            ) : ''
                        }


                        <div className="form__row__col dontdisp"></div>

                        <div className="form__row__col dontdisp"></div>
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

export default RetailerPerformanceReport