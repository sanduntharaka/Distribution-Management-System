import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import ViewAllDistributorsSalesRefs from './ViewAllDistributorsSalesRefs';

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

const DistributorSalesRef = () => {
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
    distributor: '',
    sales_ref: '',
  });

  const [distributors, setDistributors] = useState([]);
  const [salesrefs, setSalesrefs] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/users/distributors/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setDistributors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get('/users/salesrefs/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSalesrefs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post('/distributor/salesref/create/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Sales ref added under given distributor  successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Sales ref cannot add right now. Please check your data again');
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
                <div className="form__row__col__label">Distributor</div>
                <div className="form__row__col__input">
                  <select
                    type="text"
                    onChange={(e) =>
                      setData({ ...data, distributor: e.target.value })
                    }
                  >
                    {' '}
                    <option selected>Selec distributor</option>
                    {distributors.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Sales ref</div>
                <div className="form__row__col__input">
                  <select
                    type="text"
                    onChange={(e) =>
                      setData({ ...data, sales_ref: e.target.value })
                    }
                  >
                    {' '}
                    <option selected>Selec sales ref</option>
                    {salesrefs.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
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
            <ViewAllDistributorsSalesRefs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorSalesRef;
