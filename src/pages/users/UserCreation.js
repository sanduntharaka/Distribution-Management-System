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
    is_company: false,
    is_manager: false,
    password: '',
    re_password: '',
    is_distributor: false,
    is_salesref: false,
    is_superuser: false,
    is_excecutive: false,
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
        is_company: false,
        is_excecutive: false,
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
        is_company: false,
        is_excecutive: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_distributor: false,
      });
    }
  };
  const handleCheckExecutive = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_excecutive: true,
        is_distributor: false,
        is_manager: false,
        is_salesref: false,
        is_company: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_excecutive: false,
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
        is_company: false,
        is_excecutive: false,
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
        is_company: true,
        is_salesref: false,
        is_distributor: false,
        is_manager: false,
        is_excecutive: false,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_company: false,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (data.password === data.re_password) {
      setLoading(true);
      axiosLoginInstance
        .post('/users/', data)
        .then((res) => {
          setLoading(false);
          handleOpen();
          setSuccess(true);
          setError(false);
          setTitle('Success');
          setMsg('User created successfully. Please submit user details.');
          sessionStorage.setItem('new_user', res.data.id);
          if (data.is_company) {
            sessionStorage.setItem('new_user_designation', 'company');
          } else if (data.is_excecutive) {
            sessionStorage.setItem('new_user_designation', 'excecutive');
          } else if (data.is_distributor) {
            sessionStorage.setItem('new_user_designation', 'distributor');
          } else if (data.is_manager) {
            sessionStorage.setItem('new_user_designation', 'manager');
          } else if (data.is_salesref) {
            sessionStorage.setItem('new_user_designation', 'sales_rep');
          }
        })
        .catch((err) => {
          setLoading(false);
          handleOpen();
          setTitle('Error');
          setSuccess(false);
          setError(true);
          console.log('e:', err.response.request.response);
          if (err.response.request.response) {
            let msg = JSON.parse(err.response.request.response);
            if (msg.user_name) {
              setMsg(msg.user_name);
            }
            if (msg.password) {
              setMsg(msg.password);
            }
          }
        });
    } else {
      handleOpen();
      setTitle('Error');
      setSuccess(false);
      setError(true);
      setMsg('Two password you entered did not match.');
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      email: '',
      user_name: '',
      nic: '',
      is_company: false,
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
                  <p>User Name</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type Name Here"
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
                  <p>Password</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="password"
                    name="password1"
                    placeholder="Type Password Here"
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
                  <p>Passwords Must be More Than 8 Characters </p>
                  <p>Passwords Must Not Similar With User Name or Email</p>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Confirm Password</p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="password"
                    name="password2"
                    placeholder="Type Password Again"
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
                  <p>User Type</p>
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
                  {user.is_superuser ||
                    user.is_company ||
                    user.is_excecutive ? (
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
                  {user.is_company ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_excecutive}
                        onChange={(e) => handleCheckExecutive(e)}
                      />
                      <label htmlFor="">Executive</label>
                    </div>
                  ) : (
                    ''
                  )}
                  {user.is_company ||
                    user.is_manager ||
                    user.is_superuser ||
                    user.is_excecutive ? (
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
                  {user.is_company ||
                    user.is_excecutive ||
                    user.is_manager ||
                    user.is_superuser ||
                    user.is_distributor ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_salesref}
                        onChange={(e) => handleCheckSalesRef(e)}
                      />
                      <label htmlFor="">Sales Rep</label>
                    </div>
                  ) : (
                    ''
                  )}
                  {user.is_superuser ? (
                    <div className="form__row__col__input aligned">
                      <input
                        type="radio"
                        checked={data.is_company}
                        onChange={(e) => handleCheckStaff(e)}
                      />
                      <label htmlFor="">Company</label>
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
