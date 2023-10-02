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
const CretePlaning = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [psas, setPsas] = useState([])
    const [salesrefs, setSalesrefs] = useState([])
    const [salesref, setSalesref] = useState()

    const [dealers, setDealers] = useState([])

    const [items, setItems] = useState([])

    useEffect(() => {
        axiosInstance
            .get(`/psa/all/`, {
                headers: {
                    Authorization:
                        'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setPsas(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
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
    }, []);
    const handlePsa = (e) => {

        axiosInstance.get(`dealer/all/by/psa/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {

                setDealers(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
    }
    const handleSalesRef = (e) => {
        setSalesref(e.target.value)
        axiosInstance.get(`/planing/get/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {

                setItems(res.data)

            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleDealer = (e) => {

        const selected_dealer = dealers.find((obj) => {
            return obj.id == parseInt(e.target.value)
        })
        setItems([...items, {
            id: selected_dealer.id,
            name: selected_dealer.name,
            address: selected_dealer.address,

        }])

    }
    const dragItem = React.useRef(null);
    const dragOverItem = React.useRef(null);

    const handleSort = () => {
        if (dragItem.current === dragOverItem.current) {
            return; // No change needed if the dragged item is dropped on itself
        }

        const _testItems = [...items];
        const draggedItemContent = _testItems[dragItem.current];
        _testItems.splice(dragItem.current, 1); // Remove the item from the original position

        if (dragItem.current < dragOverItem.current) {
            // If the item was dragged from a lower index to a higher index
            _testItems.splice(dragOverItem.current, 0, draggedItemContent); // Insert the dragged item before the overed item
        } else {
            // If the item was dragged from a higher index to a lower index
            _testItems.splice(dragOverItem.current + 0, 0, draggedItemContent); // Insert the dragged item after the overed item
        }

        dragItem.current = null;
        dragOverItem.current = null;
        setItems(_testItems);
    };

    const handleRemove = (i) => {
        console.log("clicked")
        const selected_dealers = [...items]
        const index = i

        selected_dealers.splice(index, i)
        setItems(selected_dealers)

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(items)

        axiosInstance
            .post(
                `/planing/create/`, {
                sales_rep: salesref,
                dealers: items
            },
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
                <p>Dealers Planing for Sales Rep</p>
            </div>
            <div className="page__pcont">
                <div className="form">
                    <form action="">
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select PSA</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select psa"
                                        onChange={(e) =>
                                            handlePsa(e)
                                        }
                                        required
                                    >
                                        <option>Select PSA</option>
                                        {
                                            psas.map((item, i) => (
                                                <option value={item.id} key={i}>{item.area_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Sales Rep</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select sales rep"
                                        onChange={(e) =>
                                            handleSalesRef(e)
                                        }
                                        required
                                    >
                                        <option>Select salesref</option>
                                        {
                                            salesrefs.map((item, i) => (
                                                <option value={item.id} key={i}>{item.full_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Select Dealers</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select psa"
                                        onChange={(e) =>
                                            handleDealer(e)
                                        }
                                        required
                                    >
                                        <option>Select Dealer</option>
                                        {
                                            dealers.map((dealer, i) => (
                                                <option value={
                                                    dealer.id

                                                } key={i}>{dealer.name} | {dealer.address}</option>
                                            ))
                                        }


                                    </select>
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="dragcomponent">

                                    {
                                        items.map((itm, i) => (
                                            <div className="dragcomponent__item" draggable onDragStart={(e) => dragItem.current = i}
                                                onDragEnter={(e) => dragOverItem.current = i}
                                                onDragEnd={handleSort}
                                            >   <div>{i + 1}</div>
                                                <div>{itm.name}</div>
                                                <div className='dragcomponent__item__close' onClick={() => handleRemove(i)}>X</div>

                                            </div>
                                        ))
                                    }

                                </div>
                            </div>

                        </div>

                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button
                                    className="btnEdit"
                                    onClick={(e) => handleSubmit(e)}
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

export default CretePlaning