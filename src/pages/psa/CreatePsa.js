import React, { useState, forwardRef, useRef } from 'react';
import ViewPsas from './ViewPsas';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
const ShowMessage = forwardRef((props, ref) => {
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

const CreatePsa = () => {
  const inputRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    created_by: JSON.parse(sessionStorage.getItem('user')).id,
    area_name: '',
    more_details: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/psa/create/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Primary sales area has been created successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Primary sales area cannot create right now. Please check your data again'
        );
        handleOpen();
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
        <p>Create Primary Sales Area</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">area name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type psa name"
                    onChange={(e) =>
                      setData({ ...data, area_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">More Details</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type more details"
                    onChange={(e) =>
                      setData({ ...data, more_details: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => handleSubmit(e)}>
                  save
                </button>
                <button className="btnSave">edit</button>
              </div>
            </div>
          </form>
        </div>
        <div className="page__pcont__row">
          <div style={{ width: '100%' }}>
            <ViewPsas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePsa;
