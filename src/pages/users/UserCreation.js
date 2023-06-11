import React, { useState, forwardRef } from 'react';
import { axiosLoginInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';

import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
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
const UserCreation = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    email: '',
    user_name: '',
    nic: '',
    is_companyStaff: false,
    is_manager: false,
    password: '',
    re_password: '',
    is_distributor: false,
    is_salesref: false,
    is_superuser: false,
  });

  const handleCheckSuperuser = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_superuser: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_superuser: false,
      });
    }
  };
  const handleCheckManager = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_manager: true,
        is_distributor: false,
        is_salesref: false,
        is_companyStaff: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_manager: false,
      });
    }
  };
  const handleCheckDistributor = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_distributor: true,
        is_manager: false,
        is_salesref: false,
        is_companyStaff: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_distributor: false,
      });
    }
  };

  const handleCheckSalesRef = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_salesref: true,
        is_distributor: false,
        is_manager: false,
        is_companyStaff: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_salesref: false,
      });
    }
  };
  const handleCheckStaff = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_companyStaff: true,
        is_salesref: false,
        is_distributor: false,
        is_manager: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_companyStaff: false,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosLoginInstance
      .post('/users/', data)
      .then((res) => {
        setLoading(false);
        handleOpen();
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg('User created successfully. Please subimit user details.');
        sessionStorage.setItem('new_user', res.data.id);
      })
      .catch((err) => {
        setLoading(false);

        handleOpen();
        setTitle('Error');
        setSuccess(false);
        setError(true);
        if (err.response.data.password) {
          setMsg(err.response.data.password);
        }
      });
  };
  const handleClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      email: '',
      user_name: '',
      nic: '',
      is_companyStaff: false,
      is_manager: false,
      password: '',
      re_password: '',
      is_distributor: false,
      is_salesref: false,
      is_superuser: false,
    });
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>User Creation</p>
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
          <ShowMessage
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
                  <p>user name</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type name here"
                    autoComplete="username"
                    value={data.user_name ? data.user_name : ''}
                    onChange={(e) =>
                      setData({ ...data, user_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>password</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="password"
                    name="password1"
                    placeholder="type password here"
                    value={data.password ? data.password : ''}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  style={visible ? { color: '#d50000' } : { display: 'none' }}
                >
                  <p>passwords must be more than 8 charactors</p>
                  <p>passowrds must not similar with username or email</p>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Confirm password</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="password"
                    name="password2"
                    placeholder="type password again"
                    value={data.re_password ? data.re_password : ''}
                    onChange={(e) =>
                      setData({ ...data, re_password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>User type</p>
                </div>
                <div className="specialColumn" style={{ display: 'grid' }}>
                  {/* {user.is_superuser ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="checkbox"
                        checked={data.is_superuser}
                        onChange={(e) => handleCheckSuperuser(e)}
                      />
                      <label htmlFor="">Superuser</label>
                    </div>
                  ) : (
                    ''
                  )} */}
                  {user.is_superuser || user.is_companyStaff ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_manager}
                        onChange={(e) => handleCheckManager(e)}
                      />
                      <label htmlFor="">Manager</label>
                    </div>
                  ) : (
                    ''
                  )}
                  {user.is_companyStaff ||
                  user.is_manager ||
                  user.is_superuser ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_distributor}
                        onChange={(e) => handleCheckDistributor(e)}
                      />
                      <label htmlFor="">Distributor</label>
                    </div>
                  ) : (
                    ''
                  )}
                  {user.is_companyStaff ||
                  user.is_manager ||
                  user.is_superuser ||
                  user.is_distributor ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_salesref}
                        onChange={(e) => handleCheckSalesRef(e)}
                      />
                      <label htmlFor="">Sales ref</label>
                    </div>
                  ) : (
                    ''
                  )}
                  {user.is_superuser ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_companyStaff}
                        onChange={(e) => handleCheckStaff(e)}
                      />
                      <label htmlFor="">Company staff</label>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
              <div className="form__row__col dontdisp"></div>
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

export default UserCreation;
