import React, { useState, forwardRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
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
const UserDetails = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [loading, setLoading] = useState(false);

  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    user:
      sessionStorage.getItem('new_user') !== undefined &&
      sessionStorage.getItem('new_user')
        ? sessionStorage.getItem('new_user')
        : '',
    full_name: '',
    address: '',
    nic: '',
    email: '',
    designation:
      sessionStorage.getItem('new_user_designation') !== undefined &&
      sessionStorage.getItem('new_user_designation')
        ? sessionStorage.getItem('new_user_designation')
        : '',
    dob: '',
    company_number: '',
    personal_number: '',
    home_number: '',
    immediate_contact_person_name: '',
    immediate_contact_person_number: '',
    terriotory: '',
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/users/all/users/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post('/users/create/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        handleOpen();
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg(
          'User created successfully. Please add this user to proper relation.'
        );
        sessionStorage.removeItem('new_user_email');
        setData({ ...data, user: '' });
      })
      .catch((err) => {
        setLoading(false);

        let error = JSON.parse(err.request.response);
        console.log(typeof error);
        console.log(error);

        handleOpen();
        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Cannot save data. Please check again.');
        if (error.errors.nic) {
          setMsg(`${msg} ${error.errors.nic}`);
        }
      });
  };
  const hanldeClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      full_name: '',
      address: '',
      email: '',
      nic: '',
      designation: '',
      dob: '',
      company_number: '',
      personal_number: '',
      home_number: '',
      immediate_contact_person_name: '',
      immediate_contact_person_number: '',
      terriotory: '',
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
        <ShowMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>User Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select User Account</div>
                <div className="form__row__col__input">
                  {/* <input
                    type="text"
                    placeholder="Type name here"
                    value={data.full_name ? data.full_name : ''}
                    onChange={(e) =>
                      setData({ ...data, full_name: e.target.value })
                    }
                    required
                  /> */}
                  <select
                    defaultValue={'null'}
                    name=""
                    id=""
                    value={data.user ? data.user : ''}
                    onChange={(e) => setData({ ...data, user: e.target.value })}
                  >
                    <option value="null">Select User</option>
                    {users.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.user_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Name with Initials</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type name here"
                    value={data.full_name ? data.full_name : ''}
                    onChange={(e) =>
                      setData({ ...data, full_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div
                  className="form__row__col__label"
                  style={{ display: 'flex', gap: 5 }}
                >
                  Email
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type email here"
                    value={data.email ? data.email : ''}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Address</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type address here"
                    value={data.address ? data.address : ''}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">NIC</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder=" Type NIC number here"
                    value={data.nic ? data.nic : ''}
                    onChange={(e) => setData({ ...data, nic: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Date of Birth</div>
                <div className="form__row__col__input">
                  <input
                    type="date"
                    placeholder="Type name here"
                    value={data.dob ? data.dob : ''}
                    onChange={(e) => setData({ ...data, dob: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Designation</div>
                <div className="form__row__col__input">
                  <select
                    value={data.designation ? data.designation : ''}
                    onChange={(e) =>
                      setData({ ...data, designation: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Designation</option>

                    {user.is_company ? (
                      <>
                        <option value="Company">Company</option>
                        <option value="Executive">Excecutive</option>
                      </>
                    ) : (
                      ''
                    )}
                    {user.is_excecutive || user.is_company ? (
                      <>
                        <option value="Manager">Manager</option>
                      </>
                    ) : (
                      ''
                    )}
                    {user.is_excecutive ||
                    user.is_company ||
                    user.is_manager ? (
                      <>
                        <option value="Distributor">Distributor</option>
                      </>
                    ) : (
                      ''
                    )}

                    <option value="Sales Rep">Sales Rep</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Contact Numbers</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type company number"
                      value={data.company_number ? data.company_number : ''}
                      onChange={(e) =>
                        setData({ ...data, company_number: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type personal number"
                      value={data.personal_number ? data.personal_number : ''}
                      onChange={(e) =>
                        setData({ ...data, personal_number: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type home number"
                      value={data.home_number ? data.home_number : ''}
                      onChange={(e) =>
                        setData({ ...data, home_number: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Immediate Contact Person Name
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type here"
                    value={
                      data.immediate_contact_person_name
                        ? data.immediate_contact_person_name
                        : ''
                    }
                    onChange={(e) =>
                      setData({
                        ...data,
                        immediate_contact_person_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Immediate contact Person Number
                </div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="Type here"
                    value={
                      data.immediate_contact_person_number
                        ? data.immediate_contact_person_number
                        : ''
                    }
                    onChange={(e) =>
                      setData({
                        ...data,
                        immediate_contact_person_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Territory </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type address here"
                    value={data.terriotory ? data.terriotory : ''}
                    onChange={(e) =>
                      setData({ ...data, terriotory: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
                <button className="btnSave" onClick={(e) => hanldeClear(e)}>
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

export default UserDetails;
