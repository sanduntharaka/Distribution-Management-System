import React, { useState, useRef, forwardRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';

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

const RejectCheque = () => {
  const inputRef = useRef(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [showCheques, setShowCheques] = useState(false);
  const [cheques, setCheques] = useState([]);
  const [valuecheque, setValuecheque] = useState('');
  const [data, setData] = useState({
    cheque_number: '',
    branch: '',
    bank: '',
    date: '',
    deposited_at: '',
    number_of_dates: '',
    amount: '',
    number_of_dates: '',
  });

  //message modal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterCheques = (e) => {
    setShowCheques(true);
    setSearchLoading(true);
    axiosInstance
      .get(`/salesref/invoice/get/cheque/search?search=${e.target.value}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSearchLoading(false);
        setCheques(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setValuecheque(e.target.value);
  };

  const handleSelectCheque = (e, item) => {
    setValuecheque(item.cheque_number);
    console.log(item);
    setData({
      ...data,
      cheque_number: item.cheque_number,
      branch: item.branch,
      bank: item.bank,
      date: item.date,
      deposited_at: item.deposited_at,
      number_of_dates: item.number_of_dates,
      amount: item.amount,
      number_of_dates: item.number_of_dates,
    });
    setShowCheques(false);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setCheques([]);
    setShowCheques(false);
    setSearchLoading(false);
    setValuecheque('');
    setData({
      ...data,
      cheque_number: '',
      branch: '',
      bank: '',
      date: '',
      deposited_at: '',
      number_of_dates: '',
      amount: '',
      number_of_dates: '',
    });
  };

  const handleSaveReturn = (e) => {
    e.preventDefault()
    setLoading(true);
    axiosInstance
      .put(`/salesref/invoice/reject/cheque/`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res);

        setLoading(false);
        setError(false);
        setSuccess(true);

        setMsg('Successfully saved Your cheque as a return status.');
        setTitle('Success');
        handleOpen();
        handleClear(e);
      })
      .catch((err) => {
        console.log('er:', err);
        setLoading(false);
        setSuccess(false);
        setError(true);

        setMsg(err.response.data.error);


        setTitle('Error');
        handleOpen();
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
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          ref={inputRef}
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Add return cheque</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Type Cheque Number</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={valuecheque}
                      onChange={(e) => filterCheques(e)}
                      required
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
                      !showCheques ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    {cheques
                      .filter((item) => {
                        const searchTerm = valuecheque;
                        const cheque_number = item.cheque_number;
                        return (
                          cheque_number.includes(searchTerm) &&
                          cheque_number !== searchTerm
                        );
                      })
                      .map((item, i) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => handleSelectCheque(e, item)}
                          key={i}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.cheque_number}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Cheque Number</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type cheque number here"
                    value={data.cheque_number ? data.cheque_number : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Bank</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type bank here"
                    value={data.bank ? data.bank : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Branch</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type branch name here"
                    value={data.branch ? data.branch : ''}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Cheque Date</div>
                <div className="form__row__col__input">
                  <input type="date" value={data.date ? data.date : ''} />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Deposited at</div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    value={data.deposited_at ? data.deposited_at : ''}
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Amount</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="0"
                    value={data.amount ? data.amount : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Number of Days</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="0"
                    value={data.number_of_dates ? data.number_of_dates : ''}
                  />
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button
                  className="btnEdit"
                  title="save cheque as return"
                  onClick={(e) => handleSaveReturn(e)}
                >
                  return cheque
                </button>
                <button className="btnSave" onClick={handleClear}>
                  clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectCheque;
