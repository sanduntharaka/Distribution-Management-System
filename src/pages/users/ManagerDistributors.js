import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import ViewAllManagerDistributors from './ViewAllManagerDistributors';
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
const ManagerDistributors = ({ user }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
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
    manager: user.is_manager
      ? JSON.parse(sessionStorage.getItem('user_details')).id
      : '',
  });
  const [distributors, setDistributors] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/users/distributors/new/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setDistributors(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
    if (user.is_company) {
      axiosInstance
        .get('/users/managers/', {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          setLoading(false);

          console.log(res.data);
          setManagers(res.data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .post('/manager/distributor/create/', data, {
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
        setMsg('Distributor added under given manager  successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Distributor cannot add right now. Please check your data again'
        );
        handleOpen();
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
          ref={inputRef}
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Assign Distributors</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Managers</div>
                <div className="form__row__col__input">
                  <select
                    type="text"
                    value={data.manager}
                    onChange={(e) =>
                      setData({ ...data, manager: e.target.value })
                    }
                    disabled={user.is_manager}
                  >
                    <option value="">Select manager</option>
                    {managers.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Distributor</div>
                <div className="form__row__col__input">
                  <select
                    type="text"
                    defaultValue="0"
                    onChange={(e) =>
                      setData({ ...data, distributor: e.target.value })
                    }
                  >
                    <option value="0">Select distributor</option>
                    {distributors.map((item, i) => (
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
            <ViewAllManagerDistributors
              success={success}
              set_success={setSuccess}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDistributors;
