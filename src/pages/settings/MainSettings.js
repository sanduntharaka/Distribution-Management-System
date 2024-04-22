import React, { useState, useEffect, forwardRef } from 'react';
import Message from '../../components/message/Message';
import { axiosInstance } from '../../axiosInstance';
import Modal from '@mui/material/Modal';
const ShowMessage = forwardRef((props, ref) => {
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
const MainSettings = () => {
  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    hr_email: '',
    vat_percentage: 0,
  });

  useEffect(() => {
    axiosInstance
      .get('/settings/get/1', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {

        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        handleOpen();
        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Cannot retrieve data. Please try again.');
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/settings/create/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        handleOpen();
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg('Data added successfully. Please subimit user details.');
        sessionStorage.removeItem('new_user_email');
        setData({ ...data, hr_email: '' });
      })
      .catch((err) => {
        console.log(err);
        handleOpen();
        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Cannot save data. Please check again.');
      });
  };
  return (
    <div className="page">
      <Modal open={open} onClose={handleClose}>
        <ShowMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Main Settings</p>
      </div>
      <div></div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>HR Email</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="email"
                    placeholder="type email here"
                    autoComplete="hr_email"
                    value={data.hr_email}
                    onChange={(e) =>
                      setData({ ...data, hr_email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>VAT Rate</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="type email here"
                    autoComplete="vat_rate"
                    value={data.vat_percentage}
                    onChange={(e) =>
                      setData({ ...data, vat_percentage: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
                {/* <button className="btnSave">clear</button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainSettings;
