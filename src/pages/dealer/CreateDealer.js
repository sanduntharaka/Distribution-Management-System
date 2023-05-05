import React, { useState, forwardRef, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';

const ShowMessage = React.forwardRef((props, ref) => {
  return (
    <Message
      hide={props.handleClose}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});

const CreateDealer = () => {
  const inputRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    name: '',
    contact_number: '',
    address: '',
    owner_name: '',
    company_number: '',
    owner_personal_number: '',
    owner_home_number: '',
    assistant_name: '',
    assistant_contact_number: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/dealer/add/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Dealer has been created successfully');
        handleOpen();
        console.log(res.data);
      })
      .catch((err) => {
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Dealer cannot create right now. Please check your data again');
        handleOpen();
        console.log(err.data);
      });
  };
  return (
    <div className="page">
      <Modal open={open} onClose={handleClose}>
        <ShowMessage
          ref={inputRef}
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>

      <div className="page__title">
        <p>Dealer Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type name here"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Contact number</div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="type contact number here"
                    onChange={(e) =>
                      setData({ ...data, contact_number: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type name here"
                    onChange={(e) =>
                      setData({ ...data, owner_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner Contacts</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="type company number"
                      onChange={(e) =>
                        setData({ ...data, company_number: e.target.value })
                      }
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="type personal number"
                      onChange={(e) =>
                        setData({
                          ...data,
                          owner_personal_number: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="type home number"
                      onChange={(e) =>
                        setData({ ...data, owner_home_number: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Assistant name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type here"
                    onChange={(e) =>
                      setData({ ...data, assistant_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Assistant contact number
                </div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="type here"
                    onChange={(e) =>
                      setData({
                        ...data,
                        assistant_contact_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => handleSave(e)}>
                  save
                </button>
                <button className="btnSave">edit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDealer;
