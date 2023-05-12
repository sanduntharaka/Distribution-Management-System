import React, { useState, forwardRef, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import AllCategories from './AllCategories';
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

const Category = () => {
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
    category_name: '',
    description: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post('/category/create/', data, {
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
        setMsg('Category has been created successfully');
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Category cannot create right now. Please check your data again'
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
        <p>Create Category</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Category Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type category name"
                    onChange={(e) =>
                      setData({ ...data, category_name: e.target.value })
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
                      setData({ ...data, description: e.target.value })
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
              </div>
            </div>
          </form>
        </div>
        <div className="page__pcont__row">
          <div style={{ width: '100%' }}>
            <AllCategories />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
