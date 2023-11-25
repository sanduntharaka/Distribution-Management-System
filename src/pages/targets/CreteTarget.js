import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';

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
const CreteTarget = ({ user }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [salesrefs, setSalesrefs] = useState([])
    const [salesref, setSalesref] = useState()
    const [distributors, setDistributors] = useState([])
    const [categories, setCategories] = useState([])


    const [distributorData, setDistributorData] = useState({
        distributor: '',
        date_form: '',
        date_to: '',
        category: '',
        amount: 0,
        added_by: user.id,


    })

    const [salesrepData, setSalesrepData] = useState({
        salesrep: '',
        date_form: '',
        date_to: '',
        category: '',
        qty: 0,
        foc: 0,
        added_by: user.id,


    })

    const [salesrepValData, setSalesrepValData] = useState({
        target_person: '',
        date_form: '',
        date_to: '',
        value:'',
        added_by: user.id,
    })



    const [dealers, setDealers] = useState([])

    const [items, setItems] = useState([])

    useEffect(() => {

        axiosInstance
            .get(`/users/salesrefs/by/manager/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                console.log(res.data);

                setSalesrefs(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
        axiosInstance
            .get(`/users/distributors/by/manager/${user.id}`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                console.log(res.data);

                setDistributors(res.data);

            })
            .catch((err) => {
                console.log(err);
            });

        axiosInstance
            .get(`/category/all/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setCategories(res.data)
                console.log(res.data);
            })
            .catch((err) => {

                console.log(err);
            });
    }, []);







    const handleSubmitDistributor = (e) => {
        e.preventDefault();

        axiosInstance
            .post(
                `/target/add-distributor/`,
                distributorData,

                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setError(false)
                setSuccess(true)
                setMsg('Your data saved successfully.');
                setTitle('Success');
                handleOpen();
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('Cannot save your data. Please try again');
                setTitle('Error');
                handleOpen();
            });
    }



    const handleSubmitSalesrep = (e) => {
        e.preventDefault();

        axiosInstance
            .post(
                `/target/add-salesrep/`,
                salesrepData,

                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setError(false)
                setSuccess(true)
                setMsg('Your data saved successfully.');
                setTitle('Success');
                handleOpen();
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('Cannot save your data. Please try again');
                setTitle('Error');
                handleOpen();
            });
    }
    const handleSubmitValSalesrep = (e) => {
        e.preventDefault();

        axiosInstance
            .post(
                `/target/value-add-salesrep/`,
                salesrepValData,

                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setError(false)
                setSuccess(true)
                setMsg('Your data saved successfully.');
                setTitle('Success');
                handleOpen();
            })
            .catch((err) => {
                console.log(err);
                setSuccess(false);
                setError(true);
                setMsg('Cannot save your data. Please try again');
                setTitle('Error');
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
                <p>Target for Distributors</p>
            </div>
            <div className="page__pcont">
                <div className="form">
                    <form action="">
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Distributor</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"

                                        onChange={(e) =>
                                            setDistributorData({ ...distributorData, distributor: e.target.value })
                                        }
                                        required
                                    >
                                        <option>Select Distributor</option>
                                        {
                                            distributors.map((item, i) => (
                                                <option value={item.id} key={i}>{item.full_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date From</div>
                                <div className="form__row__col__input">

                                    <input type="date" onChange={(e) =>
                                        setDistributorData({ ...distributorData, date_form: e.target.value })
                                    } required />

                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date To</div>
                                <div className="form__row__col__input">


                                    <input type="date" onChange={(e) =>
                                        setDistributorData({ ...distributorData, date_to: e.target.value })
                                    } required />

                                </div>
                            </div>
                        </div>
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Category</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        onChange={(e) =>
                                            setDistributorData({ ...distributorData, category: e.target.value })}

                                        required
                                    >
                                        <option>Select category</option>
                                        {
                                            categories.map((category, i) => (
                                                <option value={
                                                    category.id

                                                } key={i}>{category.category_name}</option>
                                            ))
                                        }


                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Type Target Amount (Rs)</div>
                                <div className="form__row__col__input">


                                    <input type="number" placeholder='0' onChange={(e) =>
                                        setDistributorData({ ...distributorData, amount: e.target.value })}

                                        required />

                                </div>
                            </div>

                        </div>

                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button
                                    className="btnEdit"
                                    onClick={(e) => handleSubmitDistributor(e)}
                                >
                                    save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            <div className="page__title">
                <p>By Category Target  for Sales Rep</p>
            </div>
            <div className="page__pcont">
                <div className="form">
                    <form action="">
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Sales Rep</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select Sales Rep"
                                        onChange={(e) =>
                                            setSalesrepData({ ...salesrepData, salesrep: e.target.value })
                                        }
                                        required
                                    >
                                        <option>Select sales rep</option>
                                        {
                                            salesrefs.map((item, i) => (
                                                <option value={item.id} key={i}>{item.full_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date From</div>
                                <div className="form__row__col__input">

                                    <input type="date" onChange={(e) =>
                                        setSalesrepData({ ...salesrepData, date_form: e.target.value })
                                    }
                                        required />

                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date To</div>
                                <div className="form__row__col__input">


                                    <input type="date" onChange={(e) =>
                                        setSalesrepData({ ...salesrepData, date_to: e.target.value })
                                    }
                                        required />

                                </div>
                            </div>
                        </div>
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Category</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select psa"
                                        onChange={(e) =>
                                            setSalesrepData({ ...salesrepData, category: e.target.value })
                                        }
                                        required
                                    >
                                        <option>Select category</option>
                                        {
                                            categories.map((category, i) => (
                                                <option value={
                                                    category.id

                                                } key={i}>{category.category_name}</option>
                                            ))
                                        }


                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Qty</div>
                                <div className="form__row__col__input">


                                    <input type="number" placeholder='0' onChange={(e) =>
                                        setSalesrepData({ ...salesrepData, qty: e.target.value })
                                    } required />

                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Foc</div>
                                <div className="form__row__col__input">


                                    <input type="number" placeholder='0' onChange={(e) =>
                                        setSalesrepData({ ...salesrepData, foc: e.target.value })
                                    } required />

                                </div>
                            </div>

                        </div>

                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button
                                    className="btnEdit"
                                    onClick={(e) => handleSubmitSalesrep(e)}
                                >
                                    save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
            <div className="page__title">
                <p>By Value Target  for Sales Rep</p>
            </div>
            <div className="page__pcont">
                <div className="form">
                    <form action="">
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Sales Rep</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select Sales Rep"
                                        onChange={(e) =>
                                            setSalesrepValData({ ...salesrepValData, target_person: e.target.value })
                                        }
                                        required
                                    >
                                        <option>Select sales rep</option>
                                        {
                                            salesrefs.map((item, i) => (
                                                <option value={item.id} key={i}>{item.full_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date From</div>
                                <div className="form__row__col__input">

                                    <input type="date" onChange={(e) =>
                                        setSalesrepValData({ ...salesrepValData, date_form: e.target.value })
                                    }
                                        required />

                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Date To</div>
                                <div className="form__row__col__input">


                                    <input type="date" onChange={(e) =>
                                        setSalesrepValData({ ...salesrepValData, date_to: e.target.value })
                                    }
                                        required />

                                </div>
                            </div>
                        </div>
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Type Value</div>
                                <div className="form__row__col__input">
                                <input type="number" placeholder='0' onChange={(e) =>
                                        setSalesrepValData({ ...salesrepValData, value: e.target.value })
                                    } required />
                                   
                                </div>
                            </div>
                            

                        </div>

                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button
                                    className="btnEdit"
                                    onClick={(e) => handleSubmitValSalesrep(e)}
                                >
                                    save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>

        </div>
    )
}

export default CreteTarget