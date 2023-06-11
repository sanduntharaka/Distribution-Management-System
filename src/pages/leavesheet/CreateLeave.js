import React, { useState } from 'react';
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

const CreateLeave = () => {
  const user = JSON.parse(sessionStorage.getItem('user_details'));
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
    salesref: user.id,
    leave_apply_date: '',
    leave_end_date: '',
    reason: '',
    number_of_dates: '',
    is_annual: false,
    is_casual: false,
    is_sick: false,
    return_to_work: '',
    created_by: JSON.parse(sessionStorage.getItem('user')).id,
  });

  const handleCheckedAnual = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_annual: true,
        is_casual: false,
        is_sick: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_annual: false,
      });
    }
  };
  const handleCheckedCasual = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_casual: true,
        is_annual: false,
        is_sick: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_casual: false,
      });
    }
  };
  const handleCheckeSick = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_sick: true,
        is_casual: false,
        is_annual: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_sick: false,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post(`/leave/add/`, data, {
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
  const handleClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      leave_apply_date: '',
      leave_end_date: '',
      reason: '',
      number_of_dates: '',
      is_annual: false,
      is_casual: false,
      is_sick: false,
      return_to_work: '',
    });
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Create Leave</p>
      </div>
      <div>
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
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={onSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Applicant</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type name here"
                    autoComplete="salesref"
                    value={user.full_name}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Leave apply date</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    autoComplete="leave_apply_date"
                    value={data.leave_apply_date ? data.leave_apply_date : ''}
                    onChange={(e) =>
                      setData({ ...data, leave_apply_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Leave end date</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    autoComplete="leave_end_date"
                    value={data.leave_end_date ? data.leave_end_date : ''}
                    onChange={(e) =>
                      setData({ ...data, leave_end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Return to work</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    autoComplete="return_to_work"
                    value={data.return_to_work ? data.return_to_work : ''}
                    onChange={(e) =>
                      setData({ ...data, return_to_work: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>No of dates</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    autoComplete="number_of_dates"
                    placeholder="0"
                    value={data.number_of_dates ? data.number_of_dates : ''}
                    onChange={(e) =>
                      setData({ ...data, number_of_dates: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Leave type</div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="onlyour"
                    checked={data.is_annual}
                    onChange={(e) => handleCheckedAnual(e)}
                  />
                  <label htmlFor="">annual</label>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="competitor"
                    checked={data.is_casual}
                    onChange={(e) => handleCheckedCasual(e)}
                  />
                  <label htmlFor="">casual </label>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="checkbox"
                    name="payproblem"
                    checked={data.is_sick}
                    onChange={(e) => handleCheckeSick(e)}
                  />
                  <label htmlFor="">sick </label>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Reason</p>
                </div>
                <div className="form__row__col__input">
                  <textarea
                    autoComplete="reason"
                    rows="5"
                    cols="30"
                    placeholder="type here..."
                    value={data.reason ? data.reason : ''}
                    onChange={(e) =>
                      setData({ ...data, reason: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
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
    </div>
  );
};

export default CreateLeave;
