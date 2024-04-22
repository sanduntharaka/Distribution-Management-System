import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';

import TargetChart from './TargetChart';




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
const Summary = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [persons, setPersons] = useState([])

    const [person, setPerson] = useState()
    const [ranges, setRanges] = useState([])

    const [range, setRange] = useState({
        date_from: '',
        date_to: '',
        id: ''
    })


    useEffect(() => {
        axiosInstance
            .get(`/users/distri-srep/by/manager/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                console.log(res.data);

                setPersons(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    const handleRange = (i) => {
        console.log(i)
        let selected = ranges.find((item) => {
            return item.id === parseInt(i)
        })
        setRange({
            ...range,
            date_from: selected.date_from,
            date_to: selected.date_to,
            id: i
        })
        console.log(selected)
    }

    const handleFilter = () => {


        axiosInstance
            .get(`/target/get-ranges/${person}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {

                setRanges(res.data)

            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('This person is not started sales yet. Please try again later.');
                setTitle('Pending');
                handleOpen();
            });
    }
    const [data, setData] = useState([])
    const handleGetData = () => {
        axiosInstance
            .post(`/target/get-details/`,
                {
                    date_from: range.date_from,
                    date_to: range.date_to,
                    person: person
                },
                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('This person is not started sales yet. Please try again later.');
                setTitle('Pending');
                handleOpen();
            });
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
                <p>Summary</p>
            </div>
            <div className="page__pcont">
                <div className="page__pcont__row ">
                    <div className="page__pcont__row__col">
                        <p>Filter by</p>
                    </div>
                </div>
                <div className="form">
                    <div className="form__row">

                        <div className="form__row__col">
                            <div className="form__row__col__label">Person</div>
                            <div className="form__row__col__input">
                                <select
                                    name=""
                                    id=""
                                    defaultValue={''}
                                    value={person}
                                    onChange={(e) => setPerson(e.target.value)}

                                >
                                    <option value="">Select Distributor/sales Rep</option>
                                    {
                                        persons.map((item, i) => (
                                            <option value={item.id} key={i}>{item.person}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>


                        <div
                            className="form__row__col dontdisp"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <button className="btnEdit" onClick={() => handleFilter()}>
                                Filter
                            </button>
                        </div>
                    </div>
                    <div className="form__row">

                        <div className="form__row__col">
                            <div className="form__row__col__label">Ranges</div>
                            <div className="form__row__col__input">
                                <select
                                    name=""
                                    id=""
                                    defaultValue={''}
                                    value={range.id}
                                    onChange={(e) => handleRange(e.target.value)}

                                >
                                    <option value="">Select Date Range</option>

                                    {
                                        ranges.map((item, i) => (
                                            <option value={item.id} key={i}>{item.date_from} to {item.date_to}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>


                        <div
                            className="form__row__col dontdisp"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <button className="btnEdit" onClick={() => handleGetData()}>
                                Get
                            </button>
                        </div>
                    </div>
                </div>
                <div className="page__pcont__row ">
                    <TargetChart data={data} />
                </div>
            </div>


        </div>
    )
}

export default Summary