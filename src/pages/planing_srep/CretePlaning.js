import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
const CretePlaning = ({ user_details }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [day, setDay] = useState(undefined)

    const [psas, setPsas] = useState([])
    const [salesrefs, setSalesrefs] = useState([])
    const [salesref, setSalesref] = useState()

    const [dealers, setDealers] = useState([])

    const [items, setItems] = useState([])

    useEffect(() => {
        axiosInstance
            .get(`/psa/get/srep/${user_details.id}`, {
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
        // axiosInstance
        //     .get(`/users/salesrefs/by/manager/`, {
        //         headers: {
        //             Authorization:
        //                 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        //         },
        //     })
        //     .then((res) => {

        //         setSalesrefs(res.data);

        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }, []);
    const handlePsa = (e) => {

        axiosInstance.get(`dealer/all/by/psa/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {

                // setDealers(res.data);

                // const selected_dealer = dealers.find((obj) => {
                //     return obj.id == parseInt(e.target.value)
                // })
                // setItems([...items, {
                //     id: selected_dealer.id,
                //     name: selected_dealer.name,
                //     address: selected_dealer.address,

                // }])
                // console.log(res.data)

                setItems(prevItems => [
                    ...prevItems,
                    ...res.data.map(dealer => ({
                        id: dealer.id,
                        name: dealer.name,
                        address: dealer.address,
                    })),
                ]);

            })
            .catch((err) => {
                console.log(err);
            });
    }
    const [approved, setApproved] = useState(false)
    const handleDate = (e) => {
        setDay(e.target.value)
        setItems([])
        setApproved(false)

        axiosInstance.get(`/planing/get/${user_details.id}/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {
                console.log(res.data.routs)
                setItems(res.data.routs)
                if (res.data.routs[0].name == "Plan Approved") {
                    console.log('dis')
                    setApproved(true)
                }

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

    // const handleSort = () => {
    //     if (dragItem.current === dragOverItem.current) {
    //         return; // No change needed if the dragged item is dropped on itself
    //     }

    //     const _testItems = [...items];
    //     const draggedItemContent = _testItems[dragItem.current];
    //     _testItems.splice(dragItem.current, 1); // Remove the item from the original position

    //     if (dragItem.current < dragOverItem.current) {
    //         // If the item was dragged from a lower index to a higher index
    //         _testItems.splice(dragOverItem.current, 0, draggedItemContent); // Insert the dragged item before the overed item
    //     } else {
    //         // If the item was dragged from a higher index to a lower index
    //         _testItems.splice(dragOverItem.current + 0, 0, draggedItemContent); // Insert the dragged item after the overed item
    //     }

    //     dragItem.current = null;
    //     dragOverItem.current = null;
    //     setItems(_testItems);
    // };
    const handleSort = (result) => {
        if (!result.destination) {
            return;
        }

        const _testItems = [...items];
        const draggedItemContent = _testItems[result.source.index];
        _testItems.splice(result.source.index, 1); // Remove the item from the original position
        _testItems.splice(result.destination.index, 0, draggedItemContent); // Insert the dragged item at the new position

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
                sales_rep: user_details.id,
                dealers: items,
                date: day,
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
    const handleClear = (e) => {
        e.preventDefault();
        setItems([])
        setPsas([])
        setSalesrefs([])
        setSalesref('')
        setDealers([])
        setDay(0)
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
                                <div className="form__row__col__label">Date</div>
                                <div className="form__row__col__input">
                                    {/* <select
                                        type="text"
                                        placeholder="Select Day"
                                        onChange={(e) =>
                                            setDay(e.target.value)
                                        }
                                        value={day}
                                        required
                                        style={{ border: emptyDay ? '1px solid red' : '' }}
                                    >
                                        <option value={0}>Select a Day</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>

                                    </select> */}
                                    <input type="date" placeholder="Select Date" value={day} onChange={(e) =>

                                        handleDate(e)}
                                    />
                                </div>
                            </div>
                            {/* <div className="form__row__col">
                                <div className="form__row__col__label">Select Sales Rep</div>
                                <div className="form__row__col__input">
                                    <select
                                        type="text"
                                        placeholder="Select Sales Rep"
                                        onChange={(e) =>
                                            handleSalesRef(e)
                                        }
                                        required
                                    >
                                        <option>Select Sales Rep</option>
                                        {
                                            salesrefs.map((item, i) => (
                                                <option value={item.id} key={i}>{item.full_name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div> */}

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


                        </div>
                        <div className="form__row">

                            {/* <div className="form__row__col">
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
                            </div> */}
                            <div className="form__row__col">
                                <div className="dragcomponent">

                                    <DragDropContext onDragEnd={handleSort}>
                                        <Droppable droppableId="droppable">
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="dragcomponent__container"
                                                >
                                                    {items.map((itm, i) => (
                                                        <Draggable key={i} draggableId={i.toString()} index={i}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="dragcomponent__item"
                                                                >
                                                                    <div>{i + 1}</div>
                                                                    <div>{itm.name}</div>
                                                                    <div className="dragcomponent__item__close" onClick={() => handleRemove(i)}>
                                                                        X
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>

                                </div>
                            </div>

                        </div>

                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button
                                    className="btnEdit"
                                    onClick={(e) => handleSubmit(e)}
                                    disabled={approved}
                                >
                                    save
                                </button>
                                <button
                                    className="btnDelete"
                                    onClick={(e) => handleClear(e)}
                                >
                                    clear
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