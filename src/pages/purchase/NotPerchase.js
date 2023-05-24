import React, { useState, useEffect } from 'react';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import { axiosInstance } from '../../axiosInstance';
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

const NotPerchase = () => {
  //message modal
  const [loading, setLoading] = useState(false);
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

  const [dealers, setDealers] = useState([]);

  const [data, setData] = useState({
    datetime: new Date().toISOString(),
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    dealer: '',
    reason: '',
  });

  useEffect(() => {
    axiosInstance
      .get('/dealer/all/', {
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
  }, []);

  const handleCheckedOnlyOur = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_only_our: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_only_our: false,
      });
    }
  };
  const handleCheckedCompetitor = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_competitor: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_competitor: false,
      });
    }
  };
  const handleCheckeProblem = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_payment_problem: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_payment_problem: false,
      });
    }
  };
  const handleCheckedNotIn = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_dealer_not_in: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_dealer_not_in: false,
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(data);
    axiosInstance
      .post(`/not-buy/add/`, data, {
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
        setMsg('Your data added successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Your data cannot saved. Please refresh your page and try again.'
        );
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
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Non-buying details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={(e) => handleSave(e)}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select dealer</div>
                <div className="form__row__col__input">
                  <select
                    name="dealer"
                    value={data.dealer ? data.dealer : ''}
                    onChange={(e) =>
                      setData({ ...data, dealer: e.target.value })
                    }
                    required
                  >
                    <option selected>Select dealer</option>
                    {dealers.map((item, i) => (
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
                <div className="form__row__col__label">Reason</div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="onlyour"
                    onChange={(e) => handleCheckedOnlyOur(e)}
                  />
                  <label htmlFor="">Have only our goods </label>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="competitor"
                    onChange={(e) => handleCheckedCompetitor(e)}
                  />
                  <label htmlFor="">Have competitor goods </label>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="payproblem"
                    onChange={(e) => handleCheckeProblem(e)}
                  />
                  <label htmlFor="">payment problem </label>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="notin"
                    onChange={(e) => handleCheckedNotIn(e)}
                  />
                  <label htmlFor="">Dealer not in </label>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotPerchase;
