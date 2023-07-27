import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import ViewAllDistributorsSalesRefs from './ViewAllDistributorsSalesRefs';
import Spinner from '../../components/loadingSpinner/Spinner';
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const user_detail = JSON.parse(sessionStorage.getItem('user_details'));

  const [data, setData] = useState({
    added_by: user.id,
    distributor: user.is_distributor ? user_detail.id : '',
    sales_ref: '',
  });

  const [distributors, setDistributors] = useState([]);
  const [salesrefs, setSalesrefs] = useState([]);

  useEffect(() => {
    if (user.is_manager) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/by/manager/${user.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
    if (user.is_company) {
      setLoading(true);
      axiosInstance
        .get(`/users/distributors/`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log('d:', res.data);
          setDistributors(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
    setLoading(true);

    axiosInstance
      .get('/users/salesrefs/new/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setSalesrefs(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .post('/distributor/salesref/create/', data, {
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
        setMsg('Sales ref added under given distributor  successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Sales ref cannot add right now. Please check your data again');
        handleOpen();
      });
  };

  return (
    <>
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
            ref={inputRef}
            handleClose={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        </Modal>
        <div className="page__title">
          <p>Assign Distributors and Sales Reps</p>
        </div>

        <div className="page__pcont">
          <div className="form">
            <form action="">
              <div className="form__row">
                <div className="form__row__col">
                  <div className="form__row__col__label">Distributors</div>
                  <div className="form__row__col__input">
                    <select
                      type="text"
                      defaultValue={user.is_distributor ? user_detail.id : 0}
                      onChange={(e) =>
                        setData({ ...data, distributor: e.target.value })
                      }
                      disabled={user.is_distributor}
                    >
                      <option value={user.is_distributor ? user_detail.id : 0}>
                        {' '}
                        {user.is_distributor
                          ? user_detail.full_name
                          : 'Select Distributors'}
                      </option>
                      {distributors.map((item, i) => (
                        <option value={item.id} key={i}>
                          {item.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Sales Rep</div>
                  <div className="form__row__col__input">
                    <select
                      type="text"
                      defaultValue="0"
                      onChange={(e) =>
                        setData({ ...data, sales_ref: e.target.value })
                      }
                    >
                      <option value="0">Select Sales Rep</option>
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
                </div>
              </div>
            </form>
          </div>
          <div className="page__pcont__row">
            <div style={{ width: '100%' }}>
              <ViewAllDistributorsSalesRefs
                success={success}
                set_success={setSuccess}
                user_details={user_detail}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributorSalesRef;
