import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import {
    MdDoneOutline, MdOutlineClose
} from 'react-icons/md';
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
const MyPlaning = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        return `${year}-${month}-${day}`;
    });
    const [salesrefs, setSalesrefs] = useState([])
    const [data, setData] = useState({
        date: currentDate,
        salesref: JSON.parse(sessionStorage.getItem('user_details')).id
    })

    const [given, setGiven] = useState([])
    const [covered, setCovered] = useState([])

    useEffect(() => {
        axiosInstance
            .post(`/planing/get/detail/`, data, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setGiven(res.data.given)
                setCovered(res.data.coverd)
                console.log(res)
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('This person is not started sales yet. Please try again later.');
                setTitle('Pending');
                handleOpen();
            });
    }, [])

    const handleFilter = () => {


        axiosInstance
            .post(`/planing/get/detail/`, data, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setGiven(res.data.given)
                setCovered(res.data.coverd)

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
                    <div className="page__pcont__row pbox-container">
                        <div className="page__pcont__row__col pbox">
                            <p className='pbox__title'>Given Plan</p>
                            <div className='pbox__box1'>

                                {
                                    given.map((item, i) => (
                                        <div className="contentItem" key={i}>
                                            {i + 1} {item.name} {item.address} {covered.find(obj => obj.name === item.name) ? (
                                                <MdDoneOutline style={{ color: 'green' }} />
                                            ) : (
                                                <MdOutlineClose style={{ color: 'red' }} />
                                            )}
                                        </div>
                                    ))
                                }


                            </div>
                        </div>
                        <div className="page__pcont__row__col pbox">
                            <p className='pbox__title'>Details</p>
                            <div className='pbox__box2'>
                                <table>
                                    <thead>
                                        <th>#</th>
                                        <th>Dealer</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </thead>
                                    <tbody>

                                        {
                                            covered.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.time}</td>
                                                    <td>{item.status}</td>

                                                </tr>
                                            ))
                                        }



                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default MyPlaning