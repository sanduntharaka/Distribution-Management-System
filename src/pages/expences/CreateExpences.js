import React, { useState, useRef } from 'react'
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Spinner from '../../components/loadingSpinner/Spinner';
import Modal from '@mui/material/Modal';
const MyMessage = React.forwardRef((props, ref) => {
    return (
        <Message
            hide={() => props.hide()}
            success={props.success}
            error={props.error}
            title={props.title}
            msg={props.msg}
            ref={ref}
        />
    );
});
const CreateExpences = ({ inventory }) => {
    const inputRef = useRef(null);
    //message modal
    const [loading, setLoading] = useState(false);
    const [show_message, setShowMsg] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [data, setData] = useState({
        inventory: inventory.id,
        added_by: JSON.parse(sessionStorage.getItem('user')).id,
        name: '',
        amount: '',
        date: '',
        reason: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault()
        axiosInstance.post('/expences/create/', data, {
            headers: {
                Authorization:
                    'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
        })
            .then((res) => {
                setLoading(false);

                setError(false);
                setSuccess(true);
                setTitle('Success');
                setMsg('Product add to the inventory.');
                handleOpen();
            })
            .catch((err) => {
                setLoading(false);

                console.log(err);
                setSuccess(false);
                setError(true);
                setTitle('Error');
                setMsg('Cannot save data. Please check and try again.');
                handleOpen();
            });
    }
    return (<div className="page">
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
                <MyMessage
                    hide={handleClose}
                    success={success}
                    error={error}
                    title={title}
                    msg={msg}
                    ref={inputRef}
                />
            </Modal>
        }

        <div className="page__title">
            <p>Add Expences</p>
        </div>
        <div className="page__pcont">
            <div className="form">
                <form action="" onSubmit={handleSubmit}>
                    <div className="form__row">
                        <div className="form__row__col">
                            <div className="form__row__col__label">Name</div>
                            <div className="form__row__col__input">
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    name="name"
                                    value={data.name === undefined ? '' : data.name}
                                    onChange={(e) =>
                                        setData({ ...data, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                    </div>
                    <div className="form__row">

                        <div className="form__row__col">
                            <div className="form__row__col__label">Date</div>
                            <div className="form__row__col__input">
                                <input
                                    type="date"

                                    name="date"
                                    value={data.date === undefined ? '' : data.date}
                                    onChange={(e) =>
                                        setData({ ...data, date: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="form__row__col">
                            <div className="form__row__col__label">Amount</div>
                            <div className="form__row__col__input">
                                <input
                                    type="number"

                                    placeholder="0"
                                    name="amount"
                                    value={data.amount === undefined ? '' : data.amount}
                                    onChange={(e) => setData({ ...data, amount: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>



                    <div className="form__row">
                        <div className="form__row__col">
                            <div className="form__row__col__label">Reason</div>
                            <div className="form__row__col__input">
                                <textarea
                                    id="details"
                                    rows="5"
                                    cols="30"
                                    placeholder="Type here..."
                                    name="details"
                                    value={
                                        data.reason === undefined ? '' : data.reason
                                    }
                                    onChange={(e) =>
                                        setData({ ...data, reason: e.target.value })
                                    }
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    {/* <div className="form__row">
            <div className="form__row__col">
              <div className="form__row__col__label">
                <p>Choose if From Sales Return</p>
              </div>
              <div className="specialColumn" style={{ display: 'grid' }}>
                <div className="form__row__col__input aligned">
                  <input
                    type="checkbox"
                    checked={data.from_sales_return}
                    onChange={(e) => handleFromSalesReturn(e)}
                  />
                  <label htmlFor="">From Sales Return</label>
                </div>
              </div>
            </div>
            <div className="form__row__col dontdisp"></div>
            <div className="form__row__col dontdisp"></div>
          </div> */}

                    <div className="form__btn">
                        <div className="form__btn__container">
                            {/* <button className="addBtn" onClick={(e) => hanldeFileUpload(e)}>
                import
              </button> */}
                            <button className="btnEdit" type="submit">
                                save
                            </button>
                            <button className="btnSave" onClick={' '}>
                                clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
};

export default CreateExpences