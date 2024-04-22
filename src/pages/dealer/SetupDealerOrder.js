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
const SetupDealerOrder = ({ user_details }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [psas, setPsas] = useState([])

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

    }, []);
    const handlePsa = (e) => {
        setItems([])
        axiosInstance.get(`dealer/all/by/psa/${e.target.value}`, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {

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
                `/dealer/add/order/`, {
                sales_rep: user_details.id,
                dealers: items,
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
                <p>Dealers Order Setup</p>
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


                        </div>
                        <div className="form__row">

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

export default SetupDealerOrder