import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Spinner from '../../components/loadingSpinner/Spinner';
import Modal from '@mui/material/Modal';
import OldFileUpload from '../../components/fileupload/OldFileUpload';
import ViewOldCheque from './ViewOldCheque';

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
const FileUpload = React.forwardRef((props, ref) => {
  return (
    <OldFileUpload
      close={props.close}
      ditributor={props.distributor}
      url={props.url}
    />
  );
});
const AddCheque = ({ user }) => {
  const [show_message, setShowMsg] = useState(false);
  const [show_upload, setShowUplod] = useState(false);
  const [categorys, setCategorys] = useState([]);
  //message modal
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = useState({
    distributor: JSON.parse(sessionStorage.getItem('user_details')).id,
    inv_date: '',
    inv_number: '',
    customer_name: '',
    original_amount: 0,
    paid_amount: 0,
    balance_amount: 0,
    cheque_number: '',
    bank: '',
    cheque_deposite_date: '',
  });
  const [delaers, setDealers] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(`/dealer/all/`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setDealers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setShowUplod(false);
    setShowMsg(true);
    axiosInstance
      .post('/pastinv/cheque/add/', data, {
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
        setMsg('Details added successfully.');
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
  };
  const hanldeFileUpload = (e) => {
    e.preventDefault();
    setShowMsg(false);
    setShowUplod(true);
    handleOpen();
  };
  const handleClear = (e) => {
    e.preventDefault();

    setData({
      ...data,
      inv_date: '',
      inv_number: '',
      customer_name: '',
      original_amount: 0,
      paid_amount: 0,
      balance_amount: 0,
      cheque_number: '',
      bank: '',
      cheque_deposite_date: '',
    });
  };
  return (
    <div className="page">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      {show_message ? (
        <Modal open={open} onClose={handleClose}>
          <MyMessage
            hide={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        </Modal>
      ) : show_upload ? (
        <Modal open={open} onClose={handleClose}>
          <FileUpload
            close={handleClose}
            ditributor={true}
            url={`/pastinv/cheque/add/excel/${
              JSON.parse(sessionStorage.getItem('user_details')).id
            }`}
          />
        </Modal>
      ) : (
        ''
      )}
      {user.is_distributor ? (
        <>
          <div className="page__title">
            <p>Add PD cheques</p>
          </div>
          <div className="page__pcont">
            <div className="form">
              <form action="" onSubmit={handleSubmit}>
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Invoice number</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="type here"
                        name="invoice_number"
                        value={
                          data.inv_number === undefined ? '' : data.inv_number
                        }
                        onChange={(e) =>
                          setData({ ...data, inv_number: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Date</div>
                    <div className="form__row__col__input">
                      <input
                        type="date"
                        name="inv_date"
                        value={data.inv_date === undefined ? '' : data.inv_date}
                        onChange={(e) =>
                          setData({ ...data, inv_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Dealer name</div>
                    <div className="form__row__col__input">
                      <select
                        defaultValue={''}
                        onChange={(e) =>
                          setData({ ...data, customer_name: e.target.value })
                        }
                      >
                        <option value="">Select dealer</option>
                        {delaers.map((item, i) => (
                          <option value={item.id} key={i}>
                            {item.name} : {item.psa_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Cheque number</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="type here"
                        name="cheque_number"
                        value={
                          data.cheque_number === undefined
                            ? ''
                            : data.cheque_number
                        }
                        onChange={(e) =>
                          setData({ ...data, cheque_number: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Bank</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        name="bank"
                        value={data.bank === undefined ? '' : data.bank}
                        onChange={(e) =>
                          setData({ ...data, bank: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Deposited date</div>
                    <div className="form__row__col__input">
                      <input
                        type="date"
                        name="cheque_deposite_date"
                        value={
                          data.cheque_deposite_date === undefined
                            ? ''
                            : data.cheque_deposite_date
                        }
                        onChange={(e) =>
                          setData({
                            ...data,
                            cheque_deposite_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Original amount</div>
                    <div className="form__row__col__input">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="type here"
                        name="original_amount"
                        value={
                          data.original_amount === undefined
                            ? ''
                            : data.original_amount
                        }
                        onChange={(e) =>
                          setData({ ...data, original_amount: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Paid amount</div>
                    <div className="form__row__col__input">
                      <input
                        type="number"
                        placeholder="type here"
                        step="0.01"
                        min="0"
                        name="paid_amount"
                        value={
                          data.paid_amount === undefined ? '' : data.paid_amount
                        }
                        onChange={(e) =>
                          setData({ ...data, paid_amount: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">Balance amount</div>
                    <div className="form__row__col__input">
                      <input
                        type="number"
                        placeholder="type here"
                        step="0.01"
                        min="0"
                        name="balance_amount"
                        value={
                          data.balance_amount === undefined
                            ? ''
                            : data.balance_amount
                        }
                        onChange={(e) =>
                          setData({ ...data, balance_amount: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="form__btn">
                  <div className="form__btn__container">
                    <button
                      className="addBtn"
                      onClick={(e) => hanldeFileUpload(e)}
                    >
                      import
                    </button>
                    <button className="btnEdit" type="submit">
                      save
                    </button>
                    <button className="btnSave" onClick={(e) => handleClear(e)}>
                      clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
      <ViewOldCheque success={success} set_success={setSuccess} user={user} />
    </div>
  );
};

export default AddCheque;
