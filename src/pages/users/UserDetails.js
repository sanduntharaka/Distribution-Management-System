import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';

import Modal from '@mui/material/Modal';
const UserDetails = () => {
  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    user: sessionStorage.getItem('new_user_email'),
    full_name: '',
    address: '',
    designation: '',
    dob: '',
    company_number: '',
    personal_number: '',
    home_number: '',
    immediate_contact_person_name: '',
    immediate_contact_person_number: '',
    terriotory: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post('/users/create/', data, {
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
        setMsg('User created successfully. Please subimit user details.');
        sessionStorage.removeItem('new_user_email');
        setData({ ...data, user: '' });
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
  const hanldeClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      full_name: '',
      address: '',
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
      <Modal open={open} onClose={handleClose}>
        <Message
          hide={handleClose}
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
                <div className="form__row__col__label">Full Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type name here"
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
                  <p style={{ textTransform: 'lowercase' }}>
                    (please enter email that used to create user)
                  </p>
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type email here"
                    value={data.user}
                    onChange={(e) => setData({ ...data, user: e.target.value })}
                    disabled={data.user ? true : false}
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
                    placeholder="type address here"
                    value={data.address ? data.address : ''}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Designation</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type designation here"
                    value={data.designation ? data.designation : ''}
                    onChange={(e) =>
                      setData({ ...data, designation: e.target.value })
                    }
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
                    placeholder="type name here"
                    value={data.dob ? data.dob : ''}
                    onChange={(e) => setData({ ...data, dob: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Contacts</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="type company number"
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
                      placeholder="type personal number"
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
                      placeholder="type home number"
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
                    placeholder="type here"
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
                  Immediate contact Person number
                </div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="type here"
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
                <div className="form__row__col__label">Terriotory</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type address here"
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
